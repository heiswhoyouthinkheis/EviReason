/* create timeline */
var timeline = [];
/* init connection with pavlovia.org */
// const pavlovia_init = {
//   type: "jsPsychPavlovia",
//   command: "init",
// };
// timeline.push(pavlovia_init);

// ==================================================================================================================
//                                                    Import Data
// ===================================================================================================================

// #region Import

// Import variables from csv file and store them into arrays

// Initialize variables to store CSV data
let hormones = [];
let neuro = [];
let names = [];

/*Async function to load and process CSV
// Async function to load and process CSV
async function loadCSVData() {
  try {
    const response = await fetch("substance_list.csv");
    const csvData = await response.text();

    // Parse CSV using PapaParse (needs to be added to dependencies)
    const results = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    // Extract columns
    results.data.forEach((row) => {
      hormones.push(row.Hormones);
      neuro.push(row.NeuroT);
      names.push(row.Names);
    });
  } catch (error) {
    console.error("Error loading CSV data:", error);
  }
}
*/

// Sync function to load and process CSV
// This is developed for easy code development, but in the actual experiment,
// the async function should be used to load the CSV data
function loadCSVData() {
  const request = new XMLHttpRequest();
  request.open("GET", "substance_list.csv", false); // false makes the request synchronous
  request.send(null);

  if (request.status === 200) {
    const csvData = request.responseText;

    // Parse CSV using PapaParse (needs to be added to dependencies)
    const results = Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    // Extract columns
    results.data.forEach((row) => {
      hormones.push(row.Hormones);
      neuro.push(row.NeuroT);
      names.push(row.Names);
    });
  } else {
    console.error("Error loading CSV data:", request.statusText);
  }
}

loadCSVData();

// [disp] Function to print arrays to the console
function printArrays() {
  console.log("Hormones:", hormones);
  console.log("NeuroT:", neuro);
  console.log("Names:", names);
}

printArrays();

// // Check the content and the length of the arrays after loading CSV data
// loadCSVData()
//   .then(printArrays)
//   .then(() => {
//     console.log("length of hormones", hormones.length);
//   });

/* function to check if the variables are inputed and stored

// Function to display array elements on the screen
function displayData() {
  const container = document.createElement("div");
  container.id = "data-container";

  const hormonesList = document.createElement("ul");
  hormonesList.innerHTML = "<h3>Hormones</h3>";
  hormones.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    hormonesList.appendChild(listItem);
  });

  const neuroList = document.createElement("ul");
  neuroList.innerHTML = "<h3>NeuroT</h3>";
  neuro.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    neuroList.appendChild(listItem);
  });

  const namesList = document.createElement("ul");
  namesList.innerHTML = "<h3>Names</h3>";
  names.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    namesList.appendChild(listItem);
  });

  container.appendChild(hormonesList);
  container.appendChild(neuroList);
  container.appendChild(namesList);

  document.body.appendChild(container);
}

// Call displayData after loading CSV data
loadCSVData().then(displayData);

*/

// #endregion

// ==================================================================================================================
//                                                    Text Setup
// ===================================================================================================================

// region Text Setup

// Generate conditional probability combinations
const condi = ["lo", "me", "hi"];
const condprobs = [];
for (let i of condi) {
  for (let j of condi) {
    condprobs.push([i, j]);
  }
}

// [disp] Check the conditional probability combinations
console.log("Qualitative conditional probabilities:", condprobs);

// Process names array and assign them to two blocks randomly (filter out nulls and shuffle)
const validNames = names.filter((name) => name !== null);
const shuffledNames = [...validNames].sort(() => Math.random() - 0.5);
const randnames = shuffledNames.slice(0, 18); // Make sure there are 18 names, probably not necessary
const blk1_names = randnames.slice(0, 9);
const blk2_names = randnames.slice(9, 18);

// [disp] Count and display the items in shuffledNames
const shuffledNamesCount = shuffledNames.length;
console.log("Number of items in shuffledNames:", shuffledNamesCount);
console.log("shuffledNames:", shuffledNames);
console.log("blk1_names:", blk1_names);
console.log("blk2_names:", blk2_names);

// Create hormone couples
const hormone_couple = [];
for (let i = 0; i < hormones.length; i += 2) {
  hormone_couple.push(hormones.slice(i, i + 2));
}
const lastHormonePair = hormone_couple.pop();
const target_hormone = lastHormonePair[0];

// [disp] Check the hormone couples
console.log("hormone couples:", hormone_couple);
console.log("hormone couple length:", hormone_couple.length);
console.log("target hormone:", target_hormone);

// Create neuro couples
const neuro_couple = [];
for (let i = 0; i < neuro.length; i += 2) {
  neuro_couple.push(neuro.slice(i, i + 2));
}
const lastNeuroPair = neuro_couple.pop();
const target_neuro = lastNeuroPair[0];

// [disp] Check the neuro couples
console.log("target neuro:", target_neuro);

// Initialize hormone input array and input some values
const input_list_h = [];
for (let i = 0; i < hormone_couple.length; i++) {
  input_list_h.push([hormone_couple[i], condprobs[i], ["cause", "effect"]]);
}

// Initialize neuro input array and input some values
const input_list_n = [];
for (let i = 0; i < neuro_couple.length; i++) {
  input_list_n.push([neuro_couple[i], condprobs[i], ["cause", "effect"]]);
}

// [disp] Check the input arrays
console.log("input_list_h:", input_list_h);

// Create numerical value options
const loOptions = [21, 23, 25, 27, 29]; // 20-28 in steps of 2
const meOptions = [46, 48, 50, 52, 54]; // 45-53 in steps of 2
const hiOptions = [71, 73, 75, 77, 79]; // 75-83 in steps of 2

// Process hormone and neuro lists
for (let i = 0; i < input_list_h.length; i++) {
  const input_h = input_list_h[i];
  const input_n = input_list_n[i];

  // Get conditional probability indicators
  const hCond1 = input_h[1][0]; // First condition (lo/me/hi)
  const hCond2 = input_h[1][1]; // Second condition (lo/me/hi)

  // Randomly select cp1 based on first condition
  let cp1;
  switch (hCond1) {
    case "lo":
      cp1 = loOptions[Math.floor(Math.random() * loOptions.length)];
      break;
    case "me":
      cp1 = meOptions[Math.floor(Math.random() * meOptions.length)];
      break;
    case "hi":
      cp1 = hiOptions[Math.floor(Math.random() * hiOptions.length)];
      break;
  }

  // Randomly select cp2 based on second condition
  let cp2;
  switch (hCond2) {
    case "lo":
      cp2 = loOptions[Math.floor(Math.random() * loOptions.length)];
      break;
    case "me":
      cp2 = meOptions[Math.floor(Math.random() * meOptions.length)];
      break;
    case "hi":
      cp2 = hiOptions[Math.floor(Math.random() * hiOptions.length)];
      break;
  }

  // Add values to both hormone and neuro lists
  input_h.push([cp1, cp2]);
  input_n.push([cp1, cp2]);
}

// [disp] Check the input arrays before manual adjustments
console.log("input_list_h:", input_list_h);

// Manual adjustments for matching conditions
function applyManualAdjustments(list) {
  list.forEach((item) => {
    const [cond1, cond2] = item[1];

    if (cond1 === "lo" && cond2 === "lo") {
      item[3] = [25, 25]; // Override with exact values
    } else if (cond1 === "me" && cond2 === "me") {
      item[3] = [50, 50];
    } else if (cond1 === "hi" && cond2 === "hi") {
      item[3] = [80, 80];
    }
  });
}

// Apply to both hormone and neuro lists
applyManualAdjustments(input_list_h);
applyManualAdjustments(input_list_n);

// [disp] Check the input arrays after manual adjustments
console.log("input_list_h:", input_list_h);

// #endregion

// ==================================================================================================================
//                                                Text Setup Function
// ===================================================================================================================

// region Text Function

function setTextH(varA, varB, nA, nB, CorEA, CorEB, tar, name) {
  const partA = `You know that the presence of ${varA} is a ${CorEA} of ${tar}. \n\n

In 100 Groblins, on average, 5 of them has ${tar}. \n
In 100 Groblins who have ${varA}, ${nA} of them also have ${tar}. \n
In 100 Groblins who do not have ${varA}, 2 of them have ${tar}. \n
In 100 Groblins, on average, 5 of them have ${varA}. \n\n

A Groblin, named ${name}, has ${varA}.\n
How likely do you think that ${name} has ${tar}?`;

  const partB = `You also know that the presence of ${varB} is a ${CorEB} of ${tar}. \n\n

In 100 Groblins who have ${varB}, ${nB} of them also have ${tar}. \n
In 100 Groblins who do not have ${varA}, 2 of them have ${tar}. \n
In 100 Groblins, on average, 5 of them have ${varB}. \n\n

Now with further investigation, you found that ${name} also has ${varB}. \n
How likely do you think that ${name} has ${tar}?`;

  const var1 = varA[0];
  let var2;
  if (CorEA === "cause") {
    var2 = varA[0] + varB[0];
  } else if (CorEA === "effect") {
    var2 = varB[0] + varA[0];
  }

  return { partA, partB, var1, var2 };
}

function setTextN(varA, varB, nA, nB, CorEA, CorEB, tar, name) {
  const partA = `You know that the release of ${varA} is a ${CorEA} of ${tar} release.

In 100 Oxters, on average, 5 of them release ${tar}.
In 100 Oxters who release ${varA}, ${nA} of them also release ${tar}.
In 100 Oxters who do not release ${varA}, 2 of them release ${tar}.
In 100 Oxters, on average, 5 of them release ${varA}.

An Oxter, named ${name}, is found to release ${varA}.
How likely do you think that ${name} releases ${tar}?`;

  const partB = `You also know that the release of ${varB} is a ${CorEB} of ${tar} release.

In 100 Oxters who release ${varB}, ${nB} of them also release ${tar}.
In 100 Oxters who do not release ${varB}, 2 of them release ${tar}.
In 100 Oxters, on average, 5 of them release ${varB}.

Now with further investigation, you found that ${name} also releases ${varB}.
How likely do you think that ${name} releases ${tar}?`;

  const var1 = varA[0];
  let var2;
  if (CorEA === "cause") {
    var2 = varA[0] + varB[0];
  } else if (CorEA === "effect") {
    var2 = varB[0] + varA[0];
  }

  return { partA, partB, var1, var2 };
}

// [disp] Check the text functions
// Example call
const textData = setTextH(
  "Aurelin",
  "Bionexin",
  25,
  50,
  "cause",
  "effect",
  "Kinetor",
  "Zephyx"
);

// Access the generated content
console.log(textData.partA);
console.log(textData.partB);
console.log(textData.var1); // 'A'
console.log(textData.var2); // 'AB'

// endregion

// ==================================================================================================================
//                                                   Apply Text Setup Function
// ===================================================================================================================

// region Apply Function
const cause_first_h = {};
const effect_first_h = {};
const cause_first_n = {};
const effect_first_n = {};

input_list_h.forEach((caseItem, index) => {
  // Extract the qualitative conditional probability pairs from input_list_h as conditions and keys for the text
  const condition = caseItem[1].join(",");

  cause_first_h[condition] = setTextH(
    caseItem[0][0],
    caseItem[0][1],
    caseItem[3][0],
    caseItem[3][1],
    caseItem[2][0],
    caseItem[2][1],
    target_hormone,
    blk1_names[index]
  );
  effect_first_h[condition] = setTextH(
    caseItem[0][1],
    caseItem[0][0],
    caseItem[3][0],
    caseItem[3][1],
    caseItem[2][1],
    caseItem[2][0],
    target_hormone,
    blk1_names[index]
  );
});

input_list_n.forEach((caseItem, index) => {
  // Extract the qualitative conditional probability pairs from input_list_h as conditions and keys for the text
  const condition = caseItem[1].join(",");

  cause_first_n[condition] = setTextN(
    caseItem[0][0],
    caseItem[0][1],
    caseItem[3][0],
    caseItem[3][1],
    caseItem[2][0],
    caseItem[2][1],
    target_neuro,
    blk2_names[index]
  );
  effect_first_n[condition] = setTextN(
    caseItem[0][1],
    caseItem[0][0],
    caseItem[3][0],
    caseItem[3][1],
    caseItem[2][1],
    caseItem[2][0],
    target_neuro,
    blk2_names[index]
  );
});

// [disp] Check the text functions
console.log(input_list_h[2][1].join(","));
console.log(
  "Output of the text function:",
  cause_first_h[input_list_h[2][1].join(",")]
);
console.log("All the texts: ", cause_first_h);

// #endregion

// ==================================================================================================================
//                                                  Randomization
// ===================================================================================================================
// region Randomization

// Get conditions as key to access the text (e.g., "lo,me")
// also to convert them into strings

// Method 1
const conditions = Object.keys(cause_first_h);

// // Method 2
// const conditions = [];
// for (let i = 0; i < condprobs.length; i++) {
// conditions.push(condprobs[i].join(','));
// }

// [disp] Check the condition key
console.log("Condition key:", conditions);

// Seedable shuffle function (simplified version)
function seededShuffle(arr, seed) {
  const rng = new Math.seedrandom(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Initialize with seed
Math.seedrandom("5");
const cond_1 = seededShuffle([...conditions], "5").slice(0, 9);

// [disp] Check the randomized conditions
console.log("Randomized conditions:", cond_1);

// Split conditions into causes and effects for the first block
const c_first_keys = cond_1.slice(0, 4);
const e_first_keys = cond_1.slice(4, 9);

// [disp] Check the split conditions
console.log("Cause first keys:", c_first_keys);
console.log("Effect first keys:", e_first_keys);

// Create and shuffle blocks
let blk_1_list = [
  ...c_first_keys.map((key) => ({ key, value: cause_first_h[key] })),
  ...e_first_keys.map((key) => ({ key, value: effect_first_h[key] })),
];
blk_1_list = seededShuffle(blk_1_list, "blk1");

let blk_2_list = [
  ...e_first_keys.map((key) => ({ key, value: cause_first_n[key] })),
  ...c_first_keys.map((key) => ({ key, value: effect_first_n[key] })),
];
blk_2_list = seededShuffle(blk_2_list, "blk2");

// Convert to objects
const blk_1 = Object.fromEntries(
  blk_1_list.map((item) => [item.key, item.value])
);
const blk_2 = Object.fromEntries(
  blk_2_list.map((item) => [item.key, item.value])
);

// [disp] Check the blocks and sequence order
console.log("Block 1 order:", Object.keys(blk_1));
console.log("Block 2 order:", Object.keys(blk_2));
console.log("Block 1:", blk_1);
console.log("Block 2:", blk_2);

// #endregion

// ==================================================================================================================
//                                                  Data Recording Initialization
// ===================================================================================================================

// region Data Recording Init
const blk_1_record = {
  strength: Object.keys(blk_1),
  value: [],
  info_order: [],
  probabilities: [],
};

const blk_2_record = {
  strength: Object.keys(blk_2),
  value: [],
  info_order: [],
  probabilities: [],
};

// console.log("xxx", input_list_h[0][1].join(','));

// Populate values
blk_1_record.strength.forEach((key) => {
  const match = input_list_h.find((item) => item[1].join(",") === key);
  if (match) blk_1_record.value.push(match[3]);
});

// //python
// for key in blk_1.strength:
//   match = find(item[1].join(',') === key for item in input_list_h)

blk_2_record.strength.forEach((key) => {
  const match = input_list_n.find((item) => item[1].join(",") === key);
  if (match) blk_2_record.value.push(match[3]);
});

// Determine info order
blk_1_record.info_order = blk_1_record.strength.map((key) =>
  c_first_keys.includes(key) ? "cause" : "effect"
);

blk_2_record.info_order = blk_2_record.strength.map((key) =>
  e_first_keys.includes(key) ? "cause" : "effect"
);

// [disp] Check the logged data
console.log("Block 1 Record:", blk_1_record);
console.log("Block 2 Record:", blk_2_record);

// #endregion

// ==================================================================================================================
//                                                  Set Instructions
// ===================================================================================================================
// region Instructions

// Define the instruction texts for block 1 and block 2

// Block 1 instructions
const instructions_1 = [
  "In year 3021, you are assigned to a local clinic on planet p32 because of " +
    "the increasing demand for doctors who specialize in medical treatment for " +
    "the native aliens, Groblins. You have a manual that records how certain " +
    "hormones correlate with other hormones in the Groblin bodies.",

  "The balance of bodily hormones is essential for the health of Groblins. " +
    `Unfortunately, a dysfunctional presence of the hormone ${target_hormone} is spreading across the ` +
    "local Groblin population. Your clinic is flooded with concerned Groblins, " +
    `who are worried that they might have ${target_hormone} in their bodies. To make things worse, ` +
    `the apparatus that tests for ${target_hormone} is broken. `,

  `You remember about the manual you brought. With the information in the ` +
    "manual, you can infer from the presence or absence of other easily testable " +
    `hormones to judge whether ${target_hormone} is present in the Groblin. `,

  "In the following task, a group of Groblins will approach you for medical diagnosis. " +
    `For each Groblin, you will be required to make a judgment about whether ${target_hormone} ` +
    "is present in them. You will make this judgment from information about relevant hormones " +
    "that is available to you. ",

  "Due to the diversity of Groblins’ bodily makeup, each case is independent. That is, " +
    "the information for each Groblin does not carry over to any other Groblins. " +
    "However, you will need to use all information from one Groblin " +
    "to perform a diagnosis for that Groblin. ",

  "After gathering the information from the Groblin and the manual, " +
    `you will make a judgment on how likely the Groblin has ${target_hormone}. ` +
    "To make the judgment, drag the slider until you find the desired probability. " +
    "After you have made your judgment, a [continue] button will appear on the screen. " +
    "Once the button is pressed, you will not be able to modify your judgment again. ",
];

// Block 2 instructions
const instructions_2 = [
  "In year 3022, you are assigned to planet p56 to study the activities of neurotransmitters " +
    "in the native aliens, Oxters. Your predecessors have left you a manual that records how " +
    "certain neurotransmitters correlate with other neurotransmitters in the Oxter bodies.",

  "With the information in the manual, you can infer from the release of some neurotransmitters " +
    `to judge whether an Oxter releases a specific neurotransmitter, ${target_neuro}.`,

  "As part of your qualification exam, you will be presented with a set of diagnostic cases. " +
    "In each, an Oxter approaches you and you are required to make a judgment about whether they " +
    `have a release of ${target_neuro}.`,

  `Although the status of your target neurotransmitter, ${target_neuro}, is not directly ` +
    "available to you, you will be able to gather information about the release " +
    `of other neurotransmitters to predict the presence of ${target_neuro}.`,

  "Due to the diversity of Oxters’ bodily makeup, each case is independent. That is, " +
    "the information in each case does not carry over to any other cases. " +
    "However, you will need to use all information presented within each case " +
    "to make a judgment for that case.",

  "After gathering the information from the Oxter and the manual, " +
    `you will make a judgment on how likely the Groblin has a ${target_neuro} release. ` +
    "To make the judgment, drag the slider until you find the desired probability. " +
    "After you have made your judgment, a [continue] button will appear on the screen. " +
    "Once the button is pressed, you will not be able to modify your judgment again. ",
];

// import jsPsychHtmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

// Method 1
function showInstructions(instructions) {
  const timeline = [];

  instructions.forEach((text, index) => {
    timeline.push({
      type: jsPsychHtmlKeyboardResponse,
      stimulus:
        `<div style="font-size: 20px; width: 80%; margin: 0 auto;">${text}</div>` +
        `<div style="font-size: 16px; margin-top: 20px;">Press [SPACE] to continue.</div>`,
      choices: [" "],
      post_trial_gap: 500, // Optional: Add a small delay between instructions
    });
  });

  return timeline;
}

// Create instruction timelines
const block1Instructions = showInstructions(instructions_1);
const block2Instructions = showInstructions(instructions_2);

// ==================================================================================================================
//                                                   Run Trial Fucntion
// ==================================================================================================================
// region Run Trial Fucntion

/**
 * run_case: Displays two subcases on the same page (top half and bottom half).
 * @param {Object} case_info - Contains text for subcase 1 and subcase 2, plus image IDs.
 * @param {Array} slider_text - The slider labels for the left and right ends, e.g. ["absent","present"].
 * @param {Object} blk_id_record - The data object to which we will push the final pair of responses.
 */
function run_case(case_info, slider_text, blk_id_record) {
  // Identify the keys that contain your text and image IDs
  const keys = Object.keys(case_info);
  // Example: keys[0] => text1, keys[1] => text2, keys[2] => imageID1, keys[3] => imageID2

  // Construct image paths
  const image_path_1 =
    "images/causal/duo/" + String(case_info[keys[2]]) + ".png";
  const image_path_2 =
    "images/causal/tri/" + String(case_info[keys[3]]) + ".png";

  // We'll store two responses in an array, e.g. [resp1, resp2].
  let responses = [null, null];

  // We create a single HTML page with two subcases: top half and bottom half.
  // Each subcase has an <img> plus text, a slider, a live display of the slider's numeric value,
  // and a "Continue" button that we manage ourselves.
  const html_content = `
  <style>
    /* 
      We'll use a vertical flex container that takes up the full viewport height (100vh).
      We space the two subcases so the first is near the top, the second near the bottom.
      You can tweak the spacing and sizing to suit your design.
    */
    .case-container {
      display: flex;
      flex-direction: row;
      height: 100vh;
      justify-content: space-evenly; /* space them out vertically */
      align-items: center;           /* center them horizontally */
      white-space: pre-line;         /* allow line breaks in text */
      margin: 0 auto;
      box-sizing: border-box;
    }

    .subcase {
      width: 90%;
      max-width: 1000px;
      border: 1px solid #ccc;
      border-radius: 6px;
      padding: 20px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 20px; /* spacing between image and text */
    }

    .subcase.hidden {
      display: none; /* hidden subcase if we want to reveal it after Continue 1 */
    }

    .subcase-text {
      max-width: 600px;
      font-size: 20px;
      line-height: 1.4em;
    }

    .subcase-image {
      max-width: 300px;
      height: auto;
    } 

    .slider-container {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .slider {
      width: 500px;
    }

    .continue-button {
      margin-top: 10px;
      padding: 6px 12px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>

  <div class="case-container">
    <!-- TOP SUBCASE -->
    <div id="subcase1" class="subcase">
      <img class="subcase-image" src="${image_path_1}" />
      <div class="subcase-text">
        <p>${case_info[keys[0]]}</p>
        <div class="slider-container">
          <!-- We add a range slider with default 0.50, step 0.01, plus a text readout. -->
          <input type="range" id="slider1" class="slider" min="0" max="1" step="0.01" value="0.50" />
          <p>Estimated probability: <span id="slider1-value">0.50</span></p>
          <p>(${slider_text[0]} — ${slider_text[1]})</p>
          <!-- "Continue" button for subcase 1 -->
          <button id="continue1" class="continue-button" disabled>Continue</button>
        </div>
      </div>
    </div>

    <!-- BOTTOM SUBCASE (initially visible or hidden, your choice) -->
    <div id="subcase2" class="subcase hidden">
      <img class="subcase-image" src="${image_path_2}" style="max-width: 300px;" />
      <div class="subcase-text">
        <p>${case_info[keys[1]]}</p>
        <div class="slider-container">
          <input type="range" id="slider2" class="slider" min="0" max="1" step="0.01" value="0.50" disabled />
          <p>Estimated probability: <span id="slider2-value">0.50</span></p>
          <p>(${slider_text[0]} — ${slider_text[1]})</p>
          <!-- "Continue" button for subcase 2 -->
          <button id="continue2" class="continue-button" disabled>Continue</button>
        </div>
      </div>
    </div>
  </div>
  `;

  // We'll define a single trial using jsPsychHtmlButtonResponse plugin.
  // doc: https://www.jspsych.org/v7/plugins/html-button-response/
  // We set choices to an empty array so we rely on our custom "Continue" buttons.
  const singleTrial = {
    type: jsPsychHtmlButtonResponse,
    stimulus: html_content,
    choices: [], // no default plugin-based buttons
    response_ends_trial: false, // we manually end the trial with jsPsych.finishTrial()

    on_load: function () {
      // This function runs after the HTML is injected into the page.

      // 1) Attach event listener to slider1
      const slider1 = document.getElementById("slider1");
      const slider1ValueEl = document.getElementById("slider1-value");
      const continue1 = document.getElementById("continue1");

      // Enable "Continue" button only after the user moves the slider
      slider1.addEventListener("input", () => {
        const val = parseFloat(slider1.value).toFixed(2);
        slider1ValueEl.textContent = val;
        // Once user moves the slider, we can enable the button
        continue1.disabled = false;
      });

      // 2) Subcase1's "Continue" button: lock the first slider, reveal second subcase, enable second slider
      continue1.addEventListener("click", () => {
        // Save first response
        responses[0] = parseFloat(slider1.value);

        // Lock the first slider
        slider1.disabled = true;
        continue1.disabled = true;

        // Reveal subcase2
        const subcase2 = document.getElementById("subcase2");
        subcase2.classList.remove("hidden");

        // Enable second slider
        const slider2 = document.getElementById("slider2");
        slider2.disabled = false;
      });

      // 3) Attach event listener to slider2
      const slider2 = document.getElementById("slider2");
      const slider2ValueEl = document.getElementById("slider2-value");
      const continue2 = document.getElementById("continue2");

      slider2.addEventListener("input", () => {
        const val = parseFloat(slider2.value).toFixed(2);
        slider2ValueEl.textContent = val;
        continue2.disabled = false;
      });

      // 4) Subcase2's "Continue" button: store second response, finish trial
      continue2.addEventListener("click", () => {
        responses[1] = parseFloat(slider2.value);
        // Now we can end the trial and store data
        psych.finishTrial({
          responses: responses,
        });
      });
    },

    on_finish: function (data) {
      // Store the final pair of responses in your data object
      blk_id_record.probabilities.push(responses);
      console.log("Stored responses (ordered pair):", responses);
    },
  };

  return singleTrial;
}

// #endregion

// =================================================================================================================
//                                                  Construct Timeline
// =================================================================================================================
// region Construct Timeline

// Initialize jsPsych timeline

timeline.push({
  // In the newer versions of jsPsych, instead of type: "html-keyboard-response",
  // use:
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size: 24px;">Welcome to the experiment!</div>',
  choices: [" "],
});

// Block 1 instructions
timeline.push(...block1Instructions);

// Block 1 trials here
Object.keys(blk_1).forEach((key) => {
  // For each key in blk_1, create a trial using run_case function
  timeline.push(
    run_case(
      blk_1[key],
      ["Hormone is absent", "Hormone is present"],
      blk_1_record
    )
  );
});

// // Test
// oneCase = run_case(
//   blk_1[conditions[0]],
//   ["Hormone is absent", "Hormone is present"],
//   blk_1_record
// );

// timeline.push(oneCase);

// Block 2 instructions
timeline.push(...block2Instructions);

// Block 2 trials here
Object.keys(blk_2).forEach((key) => {
  // For each key in blk_1, create a trial using run_case function
  timeline.push(
    run_case(
      blk_2[key],
      ["Neurotransmitter is absent", "Neurotransmitter is present"],
      blk_2_record
    )
  );
});

timeline.push({
  // In the newer versions of jsPsych, instead of type: "html-keyboard-response",
  // use:
  type: jsPsychHtmlKeyboardResponse,
  stimulus:
    '<div style="font-size: 24px;">You have reached the end of the experiment. Thank you for your participation. Press any key to exit.</div>',
  choices: [" "],
});

/* finish connection with pavlovia.org */
// var pavlovia_finish = {
//   type: "pavlovia",
//   command: "finish",
// };
// timeline.push(pavlovia_finish);

// [disp] Check the timeline
console.log("Timeline:", timeline);

// // Run the experiment (old method?)
// jsPsych.init({
//   timeline: timeline,
//   on_finish: () => {
//     jsPsych.data.displayData();
//   },
// });

// #endregion

// =================================================================================================================
//                                                  Run Experiment
// =================================================================================================================
// region Run Experiment

// Initialize and run the experiment (new method?)
var psych = initJsPsych({
  show_progress_bar: true,
  on_finish: () => {
    psych.data.displayData();
  },
});

psych.run(timeline);
