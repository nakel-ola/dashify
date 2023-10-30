type Placement = "start" | "middle" | "end";

const getStringArray = (text: string): string[] => {
  let newText = [];
  for (const char of text) {
    newText.push(char);
  }
  return newText;
};

const truncate = (word: string, num: number, placement: Placement = "end") => {
  if (placement === "start") {
    let reverse = getStringArray(word).reverse(),
      newWord = reverse.join("").substring(0, num),
      newReverse = getStringArray(newWord).reverse().join("");

    return word.length > num ? "..." + newReverse : word;
  }

  if (placement === "middle") {
    let halfNum = Math.floor(num / 2),
      reverse = getStringArray(word).reverse(),
      newWord = reverse.join("").substring(0, halfNum),
      endWord = getStringArray(newWord).reverse().join(""),
      startWord = word.substring(0, halfNum);

    return word.length > num ? startWord + " ... " + endWord : word;
  }

  if (placement === "end") {
    return word.length > num ? word.substring(0, num) + "... " : word;
  }

  return word;
};

export default truncate;
