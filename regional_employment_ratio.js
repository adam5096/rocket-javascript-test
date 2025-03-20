// 這裡是 題目二： 各地區工作人士佔比人數
// 先向伺服器取回資料
export const getInterviewers = async function () {
  try {
    const result = await fetch(
      "https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json"
    );
    const data = await result.json();
    return data; // 返回資料
  } catch (error) {
    console.error("取得資料時發生錯誤:", error);
    return []; // 發生錯誤時返回空陣列
  }
};

// 分析各地區工作人士佔比
const getRegionRatio = function (data) {
  // 步驟 1: 計算每個地區的出現次數
  const areaCount = {};
  let totalCount = 0;

  // 統計每個地區的人數
  data.forEach((item) => {
    if (item.company && item.company.area) {
      const area = item.company.area;
      areaCount[area] = (areaCount[area] || 0) + 1;
      totalCount++;
    }
  });

  // 步驟 2: 計算百分比並排序
  return Object.entries(areaCount)
    .map(([area, count]) => ({
      [area]: Math.round((count / totalCount) * 100) + "%",
    }))
    .sort((a, b) => {
      // 提取百分比數值來排序
      const percentA = parseInt(Object.values(a)[0]);
      const percentB = parseInt(Object.values(b)[0]);
      return percentB - percentA;
    });
};

// 分析並顯示地區分佈
async function showRegionStats() {
  try {
    // 獲取資料
    const data = await getInterviewers();

    // 確認資料是否正確取得
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("無法獲取有效資料");
      return;
    }

    // 分析地區比例
    const result = getRegionRatio(data);

    // 輸出結果
    console.log("各地區工作人士佔比：", result);
    return result; // 如果需要返回結果
  } catch (error) {
    console.error("程式執行出錯:", error);
  }
}

// 執行分析流程
showRegionStats();

// 導出函數（如果需要在模組中使用）
export { getRegionRatio };
