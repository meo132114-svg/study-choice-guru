import React, { useMemo } from 'react';
import { ArrowLeft, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

// Dữ liệu giả lập (Bạn chỉ cần đổi data ở đây khi muốn cập nhật)
const SUGGESTED_DATA = [
  { ma_tohop: "A00", ten_tohop: "Toán - Lý - Hóa", mons: ["Toán", "Lý", "Hóa"], match: 95, nganhs: ["Công nghệ thông tin", "Kỹ thuật điện"] },
  { ma_tohop: "A01", ten_tohop: "Toán - Lý - Anh", mons: ["Toán", "Lý", "Anh"], match: 88, nganhs: ["Khoa học máy tính", "Quản trị kinh doanh"] },
  { ma_tohop: "D01", ten_tohop: "Toán - Văn - Anh", mons: ["Toán", "Văn", "Anh"], match: 82, nganhs: ["Ngôn ngữ Anh", "Marketing"] },
  { ma_tohop: "V00", ten_tohop: "Toán - Lý - Vẽ", mons: ["Toán", "Lý", "Vẽ"], match: 75, nganhs: ["Kiến trúc", "Thiết kế đồ họa"] },
];

export default function HollandSubjectSuggestion() {
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <button onClick={() => window.history.back()} className="flex items-center text-gray-500 mb-6 hover:text-black">
          <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gợi ý Tổ hợp môn phù hợp</h1>
          <p className="text-gray-500 mt-2">Dựa trên thế mạnh của bạn, đây là các lựa chọn tối ưu nhất</p>
        </div>

        <div className="space-y-4">
          {SUGGESTED_DATA.map((item, index) => (
            <div key={item.ma_tohop} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.ten_tohop}</h3>
                  <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded uppercase">{item.ma_tohop}</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-black text-indigo-600">{item.match}%</span>
                  <span className="text-[10px] text-gray-400 uppercase">Phù hợp</span>
                </div>
              </div>

              {/* Các môn trong tổ hợp */}
              <div className="flex flex-wrap gap-2 mb-4">
                {item.mons.map(mon => (
                  <span key={mon} className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-sm font-medium">
                    <BookOpen className="w-3 h-3" /> {mon}
                  </span>
                ))}
              </div>

              {/* Ngành gợi ý */}
              <div className="pt-4 border-t border-gray-50">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center">
                  <GraduationCap className="w-3 h-3 mr-1" /> Ngành gợi ý
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.nganhs.map(nganh => (
                    <span key={nganh} className="text-sm text-gray-600 border border-gray-200 px-3 py-1 rounded-lg bg-gray-50">
                      {nganh}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}