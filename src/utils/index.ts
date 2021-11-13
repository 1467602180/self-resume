/**
 * 随机字符串，生成uid
 * @return string
 **/
export const randomString = () => {
  return Math.random().toString(16).substr(2);
};

/**
 * 手写节流函数，实现传参
 * @param func 需要节流的函数
 * @param wait 节流时间
 * @return (...param)=>void 节流函数
 **/

export const throttleFunc = (func: () => void, wait: number) => {
  let timer;
  return (...param) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, param);
    }, wait);
  };
};

/**
 *  对比两个数组是否相等，只对比值，不对比位置
 *  @param array1 第一个数组
 *  @param array2 第二个数组
 *  @return boolean 是否相等
 **/

export const compareArray = (array1: string[], array2: string[]) => {
  let copyArray1: string[] = JSON.parse(JSON.stringify(array1));
  let copyArray2: string[] = JSON.parse(JSON.stringify(array2));
  array1.forEach((item1) => {
    array2.forEach((item2) => {
      if (item1 === item2) {
        copyArray1 = copyArray1.filter((d) => d !== item1);
        copyArray2 = copyArray2.filter((d) => d !== item1);
      }
    });
  });
  return copyArray1.length === 0 && copyArray2.length === 0;
};
