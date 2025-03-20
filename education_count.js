// 先向伺服器取回資料
const getInterviewers = async function () {
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

// 統計教育程度種類及數量的函數 (使用函數表達式)
const countEducation = (data) => {
  // 準備一個物件來存放不同教育程度的計數
  const educationCount = {};

  // 遍歷每一位面試者
  data.forEach((person) => {
    // 取得教育程度
    const education = person.education;

    // 如果這個教育程度已經在計數中，就加1；否則設為1
    if (educationCount[education]) {
      educationCount[education] += 1;
    } else {
      educationCount[education] = 1;
    }
  });

  // 將結果轉換為陣列並依數量排序（由高到低）
  const sortedResult = Object.entries(educationCount).sort(
    (a, b) => b[1] - a[1]
  );

  // 輸出教育程度種類及數量
  console.log("教育程度統計結果：");
  sortedResult.forEach(([education, count]) => {
    console.log(`${education}: ${count}人`);
  });

  // 總計
  const total = data.length;
  console.log(`總計: ${total}人`);

  return educationCount;
};

// 直接在 getInterviewers 後呼叫 countEducation
getInterviewers().then((data) => {
  countEducation(data);
});