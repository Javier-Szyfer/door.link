export const HAS_RESUME_KEY = "door:has-resume";

// Marks the page's layout from what this device remembers, before the first paint.
export const startupLayoutScript = `try{var d=document.documentElement.dataset;if(localStorage.getItem("door:view")==="list")d.view="list";if(localStorage.getItem("${HAS_RESUME_KEY}"))d.resume="1"}catch(e){}`;

// Remembers whether the next opening should reserve the continue listening row.
export const rememberResume = (hasResume: boolean) => {
  try {
    if (hasResume) localStorage.setItem(HAS_RESUME_KEY, "1");
    else localStorage.removeItem(HAS_RESUME_KEY);
  } catch {}
};
