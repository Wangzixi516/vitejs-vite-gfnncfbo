import { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  Plus, 
  TrendingUp, 
  CloudRain, 
  Zap, 
  MessageCircle, 
  Camera, 
  BrainCircuit,
  ShieldCheck,
  ThermometerSun
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// --- 模拟数据 ---

// 模拟的情绪周期曲线
const generateCycleData = () => {
  const data = [];
  for (let i = 1; i <= 30; i++) {
    let predicted = 6 + 3 * Math.sin((i - 5) * 0.25);
    if (i > 24) predicted -= 2; // PMS 惩罚
    if (predicted > 10) predicted = 10;
    if (predicted < 1) predicted = 1;
    
    data.push({
      day: `Day ${i}`,
      predicted: parseFloat(predicted.toFixed(1)),
      actual: i < 15 ? parseFloat((predicted + (Math.random() * 2 - 1)).toFixed(1)) : null 
    });
  }
  return data;
};

// 模拟的历史记录流
const initialEntries = [
  {
    id: 1,
    date: '2023-11-20',
    time: '09:30',
    type: 'manual',
    mood: 4,
    content: '早上起床说头疼，不想吃早饭。',
    aiAnalysis: '生理期第2天，身体不适导致的情绪低落。建议：准备止痛药和热水。',
    tags: ['身体不适', '经期']
  },
  {
    id: 2,
    date: '2023-11-21',
    time: '18:45',
    type: 'chat',
    mood: 3,
    imagePlaceholder: 'Chat_Screenshot.jpg',
    content: '[上传了聊天截图]',
    aiAnalysis: '监测到关键词“烦死”、“重做”。工作压力大引发的烦躁。建议：倾听为主，不要给解决方案。',
    tags: ['工作压力', '吐槽']
  }
];

// --- 组件 ---

export default function HerMoodApp() {
  const [activeTab, setActiveTab] = useState('home');
  // 移除未使用的变量，确保 Vercel 不报错
  const [currentCycleDay] = useState(26); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [entries, setEntries] = useState(initialEntries);
  
  const [newEntryText, setNewEntryText] = useState('');
  const [newEntryMood, setNewEntryMood] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 首页 - 仪表盘
  const renderDashboard = () => {
    const isPMS = currentCycleDay >= 24;
    const moodColor = isPMS ? 'text-red-500' : 'text-green-500';
    const bgColor = isPMS ? 'bg-red-50' : 'bg-green-50';
    const statusText = isPMS ? '波动剧烈 (PMS)' : '平稳上升期';
    const advice = isPMS 
      ? '今天极其容易炸毛。如果你听到“随便”二字，直接选她最爱的那家餐厅，不要追问。避免提及工作话题。' 
      : '今天状态不错，适合讨论周末出游计划或者购买大件物品。';

    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 relative overflow-hidden">
          <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl ${bgColor} text-xs font-bold uppercase tracking-wider ${moodColor}`}>
             Defcon Level: {isPMS ? '4 (Alert)' : '1 (Safe)'}
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-inner ${isPMS ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {isPMS ? 'LOW' : 'HIGH'}
            </div>
            <div>
              <h2 className="text-slate-500 text-sm font-medium">当前预测状态</h2>
              <h1 className="text-2xl font-bold text-slate-800">{statusText}</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50 p-3 rounded-xl flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-xs text-slate-400">生理周期</p>
                <p className="font-semibold text-slate-700">Day {currentCycleDay} / 28</p>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl flex items-center space-x-3">
              <CloudRain className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-slate-400">天气影响</p>
                <p className="font-semibold text-slate-700">低气压 (闷)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 text-white rounded-3xl p-6 shadow-xl transform transition hover:scale-[1.02]">
          <div className="flex items-center space-x-2 mb-3 text-yellow-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold tracking-wide text-sm">今日生存指南</h3>
          </div>
          <p className="text-lg font-light leading-relaxed opacity-90">
            "{advice}"
          </p>
          <div className="mt-4 flex gap-2">
             <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">#少说话</span>
             <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">#买甜食</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                 <BrainCircuit className="w-5 h-5 text-indigo-500" />
                 <span className="text-xs text-slate-400">AI 洞察</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-3">
                根据过去3次记录，每当阴雨天+PMS重