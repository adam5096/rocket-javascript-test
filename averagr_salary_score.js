// 從伺服器取回資料的函數
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

/**
 * 計算特定年齡範圍的平均薪水滿意度
 * @param {Array} data - 原始資料集
 * @param {string} ageRange - 要過濾的年齡範圍 (例如: "26~30 歲")
 * @returns {number} - 平均薪水滿意度
 */
export const calculateAverageSalaryScore = function (data, ageRange) {
  // 步驟1: 篩選出符合年齡範圍的資料
  const filteredData = data.filter((person) => person.age === ageRange);

  // 確認是否有找到符合條件的資料
  if (filteredData.length === 0) {
    return 0; // 或回傳其他適合的預設值
  }

  // 步驟2: 計算這些人的薪水滿意度平均值
  let totalScore = 0;
  for (let person of filteredData) {
    totalScore += parseInt(person.company.salary_score);
  }

  return totalScore / filteredData.length;
};

/**
 * 分析特定年齡群體的平均薪水滿意度
 * @param {string} ageRange - 要分析的年齡範圍 (例如: "26~30 歲")
 * @returns {Promise<number|null>} - 平均薪水滿意度或null(如果發生錯誤)
 */
export const analyzeAgeGroup = async function (ageRange) {
  try {
    // 獲取資料
    const data = await getInterviewers();

    // 如果沒有資料，顯示錯誤訊息
    if (!data || data.length === 0) {
      console.error("無法獲取資料");
      return null;
    }

    // 計算指定年齡族群的平均薪水滿意度
    const averageScore = calculateAverageSalaryScore(data, ageRange);

    // 顯示結果
    console.log(`${ageRange}族群的平均薪水滿意度: ${averageScore.toFixed(2)}`);

    // 返回結果以便可能的進一步處理
    return averageScore;
  } catch (error) {
    console.error("分析過程中發生錯誤:", error);
    return null;
  }
};

// 使用範例:
analyzeAgeGroup("26~30 歲");
analyzeAgeGroup("21~25 歲");
analyzeAgeGroup("31~35 歲");
