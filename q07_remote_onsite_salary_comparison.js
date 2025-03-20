/**
 * 從伺服器取回前端工程師職業調查資料的函數 (從資料2)
 * 這個函數會向GitHub上的一個JSON檔案發送請求，取得原始資料
 */
export const getInterviewers = async function () {
  try {
    // 向GitHub發送網路請求，取得JSON檔案
    const result = await fetch(
      "https://raw.githubusercontent.com/hexschool/2021-ui-frontend-job/master/frontend_data.json"
    );
    // 將取得的資料轉換成JavaScript物件
    const data = await result.json();
    // 返回轉換好的資料
    return data;
  } catch (error) {
    // 如果發生錯誤，在控制台中顯示錯誤訊息
    console.error("取得資料時發生錯誤:", error);
    // 返回空陣列，避免程式中斷
    return [];
  }
};

/**
 * 處理前端工程師資料，計算不同年資下各種工作模式的平均薪水滿意度
 * @param {Array} data - 從API取得的前端工程師資料陣列
 * @returns {Array} - 計算好的平均薪水滿意度資料
 */
export const processInterviewersData = function (data) {
  // 從資料中動態獲取所有工作年資的分類
  // 首先取出所有不重複的工作年資值
  const allTenures = [...new Set(data.map((item) => item.company.job_tenure))]
    .filter((tenure) => tenure) // 過濾掉空值
    .sort((a, b) => {
      // 自定義排序邏輯，讓年資按照實際大小排序
      // 先處理「X 年以下」和「X 年以上」的特殊情況
      if (a.includes("以下") && b.includes("以上")) return -1;
      if (a.includes("以上") && b.includes("以下")) return 1;

      // 從字串中提取數字，用於比較
      const getFirstNumber = (str) => parseFloat(str.match(/\d+/)?.[0] || 0);
      const aNum = getFirstNumber(a);
      const bNum = getFirstNumber(b);

      return aNum - bNum;
    });

  // 將原始年資分類轉換為顯示用的格式
  const tenureCategories = {};
  allTenures.forEach((tenure) => {
    // 移除空格並將「年」改為「工作經驗」
    tenureCategories[tenure] = `工作經驗${tenure.replace(/\s+/g, "")}`;
  });

  // 創建一個空陣列，用來儲存最終的計算結果
  const result = [];

  // 遍歷每個工作年資分類，計算薪水滿意度
  Object.entries(tenureCategories).forEach(([originalTenure, displayName]) => {
    // 篩選出該年資區間的所有資料
    const tenureData = data.filter(
      (item) => item.company.job_tenure === originalTenure
    );

    // 如果這個年資區間沒有任何資料，就跳過
    if (tenureData.length === 0) return;

    // 將該年資的資料依工作模式分類
    const officeData = tenureData.filter(
      (item) => item.company.work === "實體辦公室"
    );
    const remoteData = tenureData.filter(
      (item) => item.company.work === "遠端工作"
    );

    // 計算實體辦公室工作者的平均薪水滿意度
    // 如果有資料，計算平均值並保留一位小數；如果沒有資料，顯示"無資料"
    const officeAverage =
      officeData.length > 0
        ? (
            officeData.reduce(
              (sum, item) => sum + Number(item.company.salary_score),
              0
            ) / officeData.length
          ).toFixed(1)
        : "無資料";

    // 計算遠端工作者的平均薪水滿意度
    const remoteAverage =
      remoteData.length > 0
        ? (
            remoteData.reduce(
              (sum, item) => sum + Number(item.company.salary_score),
              0
            ) / remoteData.length
          ).toFixed(1)
        : "無資料";

    // 建立該年資區間的結果物件，並加入到結果陣列中
    // 按照出題者要求的格式構建數據
    result.push({
      [displayName]: {
        實體辦公室的平均薪水滿意度:
          officeAverage !== "無資料" ? `${officeAverage}分` : officeAverage,
        遠端工作的平均薪水滿意度:
          remoteAverage !== "無資料" ? `${remoteAverage}分` : remoteAverage,
      },
    });
  });

  // 返回最終計算好的結果
  return result;
};

/**
 * 整合取得資料和處理資料的流程，返回最終結果
 * 這是整個程式的主要執行函數
 */
export const getSalaryWorkModeSatisfaction = async function () {
  try {
    // 步驟1: 從API取得原始資料
    const interviewers = await getInterviewers();

    // 步驟2: 處理資料，計算各年資下不同工作模式的平均薪水滿意度
    const processedData = processInterviewersData(interviewers);

    // 步驟3: 返回處理好的資料
    return processedData;
  } catch (error) {
    // 如果過程中發生任何錯誤，顯示錯誤訊息
    console.error("處理資料時發生錯誤:", error);
    // 返回空陣列，避免程式中斷
    return [];
  }
};

// 實際執行主函數並顯示結果
// 這個部分會在引入模組後自動執行，顯示計算結果
getSalaryWorkModeSatisfaction().then((result) => {
  console.log("各年資的實體與遠端工作，平均薪水滿意度:");
  console.log(JSON.stringify(result, null, 2));
});