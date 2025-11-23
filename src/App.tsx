import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Calendar, 
  Plus, 
  TrendingUp, 
  CloudRain, 
  Sun, 
  Zap, 
  MessageCircle, 
  Camera, 
  AlertTriangle,
  BrainCircuit,
  ChevronRight,
  ShieldCheck,
  ThermometerSun
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// --- 模拟数据 ---

// 模拟的情绪周期曲线 (正弦波模拟激素变化)
const generateCycleData = () => {
  const data = [];
  for (let i = 1; i <= 30; i++) {
    // 简单的模拟：1-5低(经期), 14高(排卵), 24-28低(PMS)
    let predicted = 6 + 3 * Math.sin((i - 5) * 0.25);
    if (i > 24) predicted -= 2; // PMS 惩罚
    if (predicted > 10) predicted = 10;
    if (predicted < 1) predicted = 1;
    
    data.push({
      day: `Day ${i}`,
      predicted: parseFloat(predicted.toFixed(1)),
      actual: i < 15 ? parseFloat((predicted + (Math.random() * 2 - 1)).toFixed(1)) : null // 模拟过去几天的实际数据
    });
  }
  return data;
};

// 模拟的历史记录流 (手账)
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
  const [currentCycleDay, setCurrentCycleDay] = useState(26); // 假设今天是周期第26天 (PMS高危期)
  const [showAddModal, setShowAddModal] = useState(false);
  const [entries, setEntries] = useState(initialEntries);
  
  // 模拟输入状态
  const [newEntryText, setNewEntryText] = useState('');
  const [newEntryMood, setNewEntryMood] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 首页 - 仪表盘
  const renderDashboard = () => {
    // 根据周期天数决定状态
    const isPMS = currentCycleDay >= 24;
    const moodColor = isPMS ? 'text-red-500' : 'text-green-500';
    const bgColor = isPMS ? 'bg-red-50' : 'bg-green-50';
    const statusText = isPMS ? '波动剧烈 (PMS)' : '平稳上升期';
    const advice = isPMS 
      ? '今天极其容易炸毛。如果你听到“随便”二字，直接选她最爱的那家餐厅，不要追问。避免提及工作话题。' 
      : '今天状态不错，适合讨论周末出游计划或者购买大件物品。';

    return (
      <div className="space-y-6 animate-fade-in pb-20">
        {/* 头部状态卡片 */}
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

        {/* 生存指南 (Actionable Advice) */}
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

        {/* 快速概览 */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                 <BrainCircuit className="w-5 h-5 text-indigo-500" />
                 <span className="text-xs text-slate-400">AI 洞察</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-3">
                根据过去3次记录，每当阴雨天+PMS重叠时，她对“做家务”的敏感度提升 80%。建议今晚主动洗碗。
              </p>
           </div>
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                 <TrendingUp className="w-5 h-5 text-pink-500" />
                 <span className="text-xs text-slate-400">趋势</span>
              </div>
              <div className="h-16 flex items-end space-x-1">
                 {[4,3,5,2,3,2].map((h, i) => (
                   <div key={i} className={`flex-1 rounded-t-sm ${i===5 ? 'bg-red-400' : 'bg-slate-200'}`} style={{height: `${h*15}%`}}></div>
                 ))}
              </div>
              <p className="text-center text-xs text-slate-400 mt-1">预计明晚回升</p>
           </div>
        </div>
      </div>
    );
  };

  // 记录/手账流页面
  const renderTimeline = () => (
    <div className="space-y-4 pb-20 animate-fade-in">
      <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">观察日志</h2>
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-3">
             <div className="flex items-center space-x-2">
               <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{entry.date}</span>
               <span className="text-xs text-slate-400">{entry.time}</span>
             </div>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${entry.mood < 5 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
               {entry.mood}
             </div>
           </div>
           
           <div className="mb-4">
             {entry.type === 'chat' && (
               <div className="bg-slate-100 rounded-lg p-4 mb-3 flex items-center justify-center border-2 border-dashed border-slate-200">
                  <div className="text-center">
                    <MessageCircle className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400">聊天记录截图 (已处理)</span>
                  </div>
               </div>
             )}
             <p className="text-slate-700 text-sm leading-relaxed">{entry.content}</p>
           </div>

           {/* AI 分析胶囊 */}
           <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 relative">
             <div className="absolute -top-2 left-3 bg-white px-2 py-0.5 rounded-full border border-indigo-100 flex items-center shadow-sm">
                <Zap className="w-3 h-3 text-indigo-500 mr-1" />
                <span className="text-[10px] font-bold text-indigo-600 uppercase">AI Analysis</span>
             </div>
             <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
               {entry.aiAnalysis}
             </p>
           </div>
        </div>
      ))}
      <div className="text-center text-slate-400 text-xs py-4">没有更多记录了</div>
    </div>
  );

  // 趋势图表页面
  const renderTrends = () => {
    const data = generateCycleData();
    return (
      <div className="h-full flex flex-col pb-20 animate-fade-in">
        <h2 className="text-xl font-bold text-slate-800 mb-2 px-2">周期全景</h2>
        <p className="text-slate-500 text-sm px-2 mb-6">基于过去 3 个月的数据模型预测</p>
        
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex-grow max-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" hide />
              <YAxis domain={[0, 10]} hide />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                cursor={{stroke: '#cbd5e1', strokeWidth: 1}}
              />
              <ReferenceLine x={`Day ${currentCycleDay}`} stroke="red" strokeDasharray="3 3" label="Today" />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#818cf8" 
                strokeWidth={3} 
                dot={false} 
                name="预测情绪"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#f43f5e" 
                strokeWidth={2} 
                dot={{r: 4, strokeWidth:0}} 
                connectNulls 
                name="实际记录"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 px-4">
           <h3 className="font-bold text-slate-700 mb-3">关键因子相关性</h3>
           <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <span className="text-sm text-slate-600 flex items-center"><CloudRain className="w-4 h-4 mr-2 text-blue-400"/> 阴雨天</span>
                 <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-red-400 h-full w-[80%]"></div>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <span className="text-sm text-slate-600 flex items-center"><ThermometerSun className="w-4 h-4 mr-2 text-orange-400"/> 睡眠不足</span>
                 <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-red-400 h-full w-[60%]"></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  // 添加新记录的模态框
  const renderAddModal = () => {
    if (!showAddModal) return null;
    
    const handleAdd = () => {
      setIsAnalyzing(true);
      // 模拟 AI 分析过程
      setTimeout(() => {
        const newEntry = {
            id: Date.now(),
            date: '2023-11-22',
            time: 'Now',
            type: 'manual', // or chat
            mood: newEntryMood,
            content: newEntryText || '[图片上传分析]',
            aiAnalysis: '根据描述/截图，这属于典型的“寻求共情”信号。她并不需要你解决问题，只是想让你站在她这边。',
            tags: ['AI Auto-Tag']
        };
        setEntries([newEntry, ...entries]);
        setIsAnalyzing(false);
        setShowAddModal(false);
        setNewEntryText('');
        setActiveTab('timeline'); // 跳转到时间轴看结果
      }, 1500);
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-6 animate-slide-up">
          <h3 className="text-xl font-bold text-slate-800 mb-6">记录新状态</h3>
          
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">心情打分 (1-10)</label>
            <input 
              type="range" 
              min="1" max="10" 
              value={newEntryMood} 
              onChange={(e) => setNewEntryMood(e.target.value)}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>😭 崩溃</span>
              <span className="font-bold text-indigo-600 text-lg">{newEntryMood}</span>
              <span>🤩 狂喜</span>
            </div>
          </div>

          <div className="mb-4 space-y-3">
             <button className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-indigo-300 transition group">
                <Camera className="w-6 h-6 mb-1 group-hover:text-indigo-500" />
                <span className="text-xs">上传聊天截图 / 邮件 / 表情照片</span>
             </button>
             <div className="relative">
                <textarea 
                  className="w-full bg-slate-50 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  placeholder="或者直接写点什么... 例如：她刚才抱怨咖啡不好喝。"
                  value={newEntryText}
                  onChange={(e) => setNewEntryText(e.target.value)}
                ></textarea>
             </div>
          </div>

          <div className="flex space-x-3">
            <button 
              onClick={() => setShowAddModal(false)}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-semibold"
            >
              取消
            </button>
            <button 
              onClick={handleAdd}
              disabled={isAnalyzing}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center"
            >
              {isAnalyzing ? (
                 <>
                   <BrainCircuit className="w-5 h-5 mr-2 animate-pulse" />
                   AI 分析中...
                 </>
              ) : (
                '保存并分析'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-900 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl flex flex-col">
        
        {/* Top Header */}
        <div className="pt-12 px-6 pb-4 bg-white sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div>
               <h1 className="text-2xl font-black text-slate-800 tracking-tight">Her Mood.</h1>
               <p className="text-xs text-slate-400">周期同步助手</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 px-6 overflow-y-auto pt-2 scrollbar-hide">
          {activeTab === 'home' && renderDashboard()}
          {activeTab === 'timeline' && renderTimeline()}
          {activeTab === 'trends' && renderTrends()}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-lg border-t border-slate-100 px-6 py-4 pb-8 flex justify-between items-center z-20">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Heart className={`w-6 h-6 ${activeTab === 'home' ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">今日</span>
          </button>

          <button 
            onClick={() => setActiveTab('trends')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'trends' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-[10px] font-medium">趋势</span>
          </button>

          {/* Floating Action Button */}
          <div className="relative -top-6">
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-14 h-14 bg-slate-900 rounded-full shadow-lg shadow-slate-400/50 flex items-center justify-center text-white transform transition active:scale-95 hover:bg-slate-800"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>

          <button 
            onClick={() => setActiveTab('timeline')}
            className={`flex flex-col items-center space-y-1 ${activeTab === 'timeline' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-[10px] font-medium">手账</span>
          </button>
          
          <button className="flex flex-col items-center space-y-1 text-slate-400 hover:text-slate-600">
             <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center">
               <span className="text-[10px] font-bold">?</span>
             </div>
             <span className="text-[10px] font-medium">设置</span>
          </button>
        </div>

        {renderAddModal()}
      </div>
      
      {/* CSS for simple animations */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(100%); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}