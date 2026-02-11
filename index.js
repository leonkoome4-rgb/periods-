// period calculator script


document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('cycle-form');
  const resultBox = document.getElementById('result');

  //  loads without the form
  if (!form || !resultBox) {
    return;
  }

  
  let savedLast = localStorage.getItem('lastPeriod');
  let savedCycle = localStorage.getItem('cycleLength');
  let savedDur = localStorage.getItem('periodDuration');

  if (savedLast) document.getElementById('lastPeriod').value = savedLast;
  if (savedCycle) document.getElementById('cycleLength').value = savedCycle;
  if (savedDur) document.getElementById('periodDuration').value = savedDur;

  // auto show results if data exists
  if (savedLast && savedCycle) {
    showResults(savedLast, parseInt(savedCycle, 10), parseInt(savedDur || 5, 10));
  }

  // form submit
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const lastDate = document.getElementById('lastPeriod').value;
    const cycleLen = parseInt(document.getElementById('cycleLength').value, 10);
    const periodDur = parseInt(document.getElementById('periodDuration').value, 10);

    if (!lastDate || isNaN(cycleLen) || isNaN(periodDur)) {
      resultBox.textContent = 'Please fill all fields correctly.';
      return;
    }

    // simple validation (not perfect but helps)
    if (cycleLen < 18 || cycleLen > 45) {
      resultBox.textContent = 'Cycle length looks unrealistic.';
      return;
    }

    if (periodDur < 1 || periodDur > 14) {
      resultBox.textContent = 'Period duration should be between 1 and 14 days.';
      return;
    }

    // save for next page
    localStorage.setItem('lastPeriod', lastDate);
    localStorage.setItem('cycleLength', cycleLen);
    localStorage.setItem('periodDuration', periodDur);

    // go to results page
    window.location.href = 'your next period .html';
  });

  // calculate and show results
  function showResults(lastDateStr, cycleLength, duration) {

    const lastDate = new Date(lastDateStr);

    const nextStart = new Date(lastDate);
    nextStart.setDate(nextStart.getDate() + cycleLength);

    const nextEnd = new Date(nextStart);
    nextEnd.setDate(nextEnd.getDate() + duration - 1);

    // ovulation is approx 14 days before next period
    const ovulationDay = new Date(lastDate);
    ovulationDay.setDate(ovulationDay.getDate() + (cycleLength - 14));

    const fertileStart = new Date(ovulationDay);
    fertileStart.setDate(fertileStart.getDate() - 5);

    const fertileEnd = new Date(ovulationDay);
    fertileEnd.setDate(fertileEnd.getDate() + 1);

    resultBox.innerHTML = `
      <h3>📅 Results</h3>
      <p><strong>Next expected period:</strong> ${nextStart.toLocaleDateString()}</p>
      <p><strong>Expected end:</strong> ${nextEnd.toLocaleDateString()}</p>
      <p><strong>Fertile window (estimate):</strong><br>
        ${fertileStart.toLocaleDateString()} – ${fertileEnd.toLocaleDateString()}
      </p>
      <p style="color:#7b4960;font-weight:600;">
        ⚠️ This is only an estimate. Cycles can change.
      </p>
    `;
  }

});
