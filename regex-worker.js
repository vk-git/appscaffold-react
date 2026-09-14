// Run untrusted regular expressions off the UI thread. The caller terminates slow jobs.
self.onmessage = function (event) {
  try {
    const { pattern, flags, input } = event.data;
    const re = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
    const matches = []; let match;
    while ((match = re.exec(input)) !== null && matches.length < 200) {
      matches.push({ text: match[0], index: match.index, groups: match.slice(1) });
      if (match[0] === '') re.lastIndex += 1;
    }
    self.postMessage({ output: JSON.stringify(matches, null, 2) });
  } catch { self.postMessage({ error: 'Invalid regular expression or flags.' }); }
};
