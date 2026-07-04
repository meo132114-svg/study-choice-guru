import React from 'react';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';

// Dữ liệu mẫu (Bạn có thể thay thế bằng dữ liệu từ Supabase)
const SUGGESTED_DATA = [
  { ma_tohop: "TH2", score_pct: 93, xe_tuyen: "A00 - A01 - B00 - D01 - D07", nganhs: ["Máy tính & CNTT", "Kỹ thuật", "Sức khỏe (Y, Dược)"] },
  { ma_tohop: "TH3", score_pct: 93, xe_tuyen: "A00 - A01 - D01 - D07", nganhs: ["Kỹ thuật", "Công nghệ kỹ thuật"] },
  { ma_tohop: "TH4", score_pct: 93, xe_tuyen: "A00 - A01 - D01 - D07", nganhs: ["Máy tính & CNTT", "Kỹ thuật"] },
  { ma_tohop: "TH5", score_pct: 88, xe_tuyen: "A00 - A01 - D07", nganhs: ["Kinh tế", "Quản trị kinh doanh"] },
];

export default function HollandSubjectSuggestion() {
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <button onClick={() => window.history.back()} className="flex items-center text-gray-500 mb-6 hover:text-black">
          <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Gợi ý tổ hợp phù hợp</h1>

        <div className="space-y-6">
          {SUGGESTED_DATA.map((item) => (
            <div key={item.ma_tohop} className="bg-white p-6 rounded-3xl border-2 border-orange-200 shadow-sm">
              {/* Header card */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-black text-gray-800">{item.ma_tohop}</h2>
                  <p className="text-sm font-semibold text-gray-600 mt-1">Xét ĐH: {item.xe_tuyen}</p>
                </div>
                {/* Phần trăm nguyên */}
                <span className="text-3xl font-bold text-gray-800">{item.score_pct}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${item.score_pct}%` }}></div>
              </div>

              {/* Nhóm ngành */}
              <div className="flex flex-wrap gap-2 mb-6">
                {item.nganhs.map(nganh => (
                  <span key={nganh} className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full">
                    {nganh}
                  </span>
                ))}
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button className="border-2 border-gray-200 py-2 rounded-xl text-sm font-bold hover:bg-gray-50">Chọn làm NV1</button>
                <button className="border-2 border-gray-200 py-2 rounded-xl text-sm font-bold hover:bg-gray-50">Chọn làm NV2</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}