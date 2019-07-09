'use strict';

const creditSum = document.getElementById('creditSum'),
  creditProcent = document.getElementById('creditProcent'),
  creditTime = document.getElementById('creditTime'),

  inpAnn = document.getElementById('annuit'),
  inpDif = document.getElementById('differ'),

  annuitInfo = document.getElementById('ann'),
  differInfo = document.getElementById('dif'),

  inpPayEveryMonth = document.querySelector('.monthPay'),
  inpOverPayment = document.querySelector('.overPaymant'),
  inpTotalSum = document.querySelector('.totalSum'),
  inpOverPaymentInProcent = document.querySelector('.overPaymantInProcent'),

  btnStart = document.getElementsByTagName('button')[0],
  error = document.querySelector('.error'),

  containerTable = document.querySelector('.tableContainter'),
  table = document.getElementsByTagName('table')[0],
  tbody = document.getElementsByTagName('tbody')[0],
  mem = document.querySelector('.mem');
 
console.log(creditTime);

let contains,
    showAll = document.createElement('p'),
    runMem = true;


function maxlength(e, n) {
      if (e.keyCode == 8 || e.keyCode == 9) {
        return true;
      }
      if (this.value.length > 2 ) {
        e.preventDefault();
      }
    }

    creditProcent.addEventListener('keydown', maxlength);
    creditTime.addEventListener('keydown', maxlength);

//mem show
creditProcent.addEventListener('blur', function() {
  if (runMem && creditProcent.value > 99 ) {
    mem.classList.toggle('showMem');
    setTimeout(function() {
      mem.classList.toggle('showMem');
    },1000)
    runMem = false;
  }
});

// thank you, MDN
(function () {
  function decimalAdjust(type, value, exp) {
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
  if (!Math.round10) {
    Math.round10 = function (value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
})();

// find dates
function findDate(i) {
  let days = (new Date().getDate() > 9) ? new Date().getDate() : `0${new Date().getDate()}`;
  let year = new Date(new Date().getFullYear(), new Date().getMonth() + i, days).getFullYear();
  let month = new Date(year, new Date().getMonth() + 2 + i, days).getMonth();
  month = month > 9 ? month : `0${month}`;
  month = month == '00' ? 12 : month;

  return `${days}.${month}.${year}`;
}

// annuity function
function calculateAnnitTable(sum, procent, time, arrTotalPayInMoth, arrPayToDebt, arrPayToProcent, arrLastDebt) {
  let ocplt, prplt;
  let starSum = creditSum.value,
    rate = procent / 12 / 100,
    pc = sum,
    kper = time,

    plt = Math.round10((pc * rate) / (1 - (1 + rate) ** -kper), -2);

  for (let i = 0; i < kper; i++) {
    arrTotalPayInMoth[i] = plt;

    ocplt = Math.round10((plt - pc * rate) * (1 + rate) ** (i + 1 - 1), -2);
    arrPayToDebt[i] = ocplt;

    prplt = Math.round10(plt - ocplt, -2);
    arrPayToProcent[i] = prplt;

    starSum = Math.round10(starSum - ocplt, -2);
    arrLastDebt[i] = starSum;
  };
  // show in table value
  return showCalculateInTable(arrTotalPayInMoth, arrPayToDebt, arrPayToProcent, arrLastDebt);
};



// differentiated function 
function calculateDifferTable(sum, procent, time, arrTotalPayInMoth, arrPayToDebt, arrPayToProcent, arrLastDebt) {
  let payOneMonth = (sum / time).toFixed(2),
    starSum = sum;

  arrLastDebt = [starSum];
  arrPayToDebt = [+payOneMonth];

  for (let i = 1; i < time; i++) {
    starSum -= payOneMonth;
    starSum = Math.round10(starSum, -2);
    arrLastDebt[i] = starSum;
    arrPayToDebt[i] = +payOneMonth;
  }

  arrLastDebt.forEach(function (item, i) {
    arrPayToProcent.push(Math.round10(item * (procent / 100) * (findDaysInMonthAndYearss(new Date().getMonth() + 1 + i)), -2));
  });

  arrLastDebt.shift();
  arrLastDebt[arrLastDebt.length] = 0;

  for (let i = 0; i < arrLastDebt.length; i++) {
    arrTotalPayInMoth.push(Math.round10(+payOneMonth + arrPayToProcent[i], -2));
  }

  // show in table value
  return showCalculateInTable(arrTotalPayInMoth, arrPayToDebt, arrPayToProcent, arrLastDebt);
}

// find how many days in a month and in a year
function findDaysInMonthAndYearss(month) {
  let days = new Date(new Date().getFullYear(), month, 0).getDate();
  let year = new Date(new Date().getFullYear(), month, 0).getFullYear();
  let howDaysInYear = new Date(year, 2, 0).getDate();
  howDaysInYear = (howDaysInYear == 29) ? 366 : 365;

  return days / howDaysInYear;
}


// displays annuity calculation in the table
function showCalculateInTable(arrTotalPayInMoth, arrPayToDebt, arrPayToProcent, arrLastDebt) {

  // if the function is called again, the loop will delete the past value
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
    table.classList.remove('show');
  }

  contains = document.querySelector('.center');
  if (contains) {
    contains.remove();
  }


  table.classList.add('show');

  for (let i = 0; i < arrTotalPayInMoth.length; i++) {

    const tr = document.createElement('tr');
    const tdPeriod = document.createElement('td');
    tdPeriod.innerText = i + 1;

    const tdTime = document.createElement('td');
    tdTime.innerText = findDate(i);

    const tdSum = document.createElement('td');
    tdSum.innerText = arrTotalPayInMoth[i].toLocaleString('en');

    const tdPayToDabt = document.createElement('td');
    tdPayToDabt.innerText = arrPayToDebt[i].toLocaleString('en');

    const tdPayToProcent = document.createElement('td');
    tdPayToProcent.innerText = arrPayToProcent[i].toLocaleString('en');

    const tdLastDebt = document.createElement('td');
    tdLastDebt.innerText = arrLastDebt[i].toLocaleString('en');

    const tdDescription = document.createElement('td');

    let nextMonth = () => {
      let x = findDate(i + 1),
        z = x.split('.');
      return (z[1] != '01') ? `Платёж за ${z[1]}/${z[2]}` : `Платёж за ${z[1]}/${Number(z[2])+1}`
    }
    tdDescription.innerHTML = nextMonth(i);

    tr.appendChild(tdPeriod);
    tr.appendChild(tdTime);
    tr.appendChild(tdSum);
    tr.appendChild(tdPayToDabt);
    tr.appendChild(tdPayToProcent);
    tr.appendChild(tdLastDebt);
    tr.appendChild(tdDescription);

    tbody.appendChild(tr);

    if (i <= 9) {
      tbody.appendChild(tr);
    } else {
      tr.classList.add('hide');
      tbody.appendChild(tr);
    }

    if (i == arrTotalPayInMoth.length - 1 && i > 9) {

      showAll.classList.add('center');
      showAll.innerText = 'Показать всё';

      containerTable.appendChild(showAll);
    }
  }
};

showAll.addEventListener('click', function () {
  let arrTr = document.querySelectorAll('tr');
  for (let i = 10; i < arrTr.length; i++) {
    if (arrTr[i].classList.contains('hide')) {
      arrTr[i].classList.remove('hide');
      arrTr[i].classList.add('show');
    };
  };
  containerTable.removeChild(showAll);
});




btnStart.addEventListener('click', function () {

  const sum = creditSum.value,
    procent = creditProcent.value,
    time = +creditTime.value,
    typePayment = (inpAnn.checked == true),

    haveNum = (!isNaN(sum) && !isNaN(procent) && !isNaN(time) && sum != 0 && procent != 0 && time != 0);

  if (!haveNum) {
    if (error.classList.contains('hide')) {
      error.classList.remove('hide');
      error.classList.add('show');
    };
    return;
  }

  if (error.classList.contains('show')) {
    error.classList.remove('show');
    error.classList.add('hide');
  }

  let arrTotalPayInMoth = [],
      arrPayToDebt = [],
      arrPayToProcent = [],
      arrLastDebt = [];

  if (typePayment) {
    // annuity payment

    // calculate value
    calculateAnnitTable(sum, procent, time, arrTotalPayInMoth, arrPayToDebt, arrPayToProcent, arrLastDebt);

    // show total value in form
    let payEveryMonth = arrTotalPayInMoth[0],
      reducer = (accumulator, currentValue) => accumulator + currentValue,
      totalSumToPay = Math.round10(arrTotalPayInMoth.reduce(reducer), -2),
      totalOverPayment = Math.round10(arrPayToProcent.reduce(reducer), -2),
      payInProcent = Math.round10((totalOverPayment / sum) * 100, -2);

    inpPayEveryMonth.value = (payEveryMonth).toLocaleString('en');
    inpTotalSum.value = (totalSumToPay).toLocaleString('en');
    inpOverPayment.value = (totalOverPayment).toLocaleString('en');
    inpOverPaymentInProcent.value = `${(payInProcent).toLocaleString('en')}% от суммы кредита`;

  } else {
    // differentiated payment

    // calculate value
    calculateDifferTable(sum, procent, time, arrTotalPayInMoth, arrPayToDebt, arrPayToProcent, arrLastDebt);

    // show total value in form    
    let reducer = (accumulator, currentValue) => accumulator + currentValue,
        totalSum = arrTotalPayInMoth.reduce(reducer);
        totalSum = Math.round10(totalSum, -2); // Итоговая сумма сколько нужно будет выплатить
    let overPayment = totalSum - sum,
      payInProcent = Math.round10(overPayment / sum * 100, -2);

    inpPayEveryMonth.value = `${(arrTotalPayInMoth[0]).toLocaleString('en')} ... ${(arrTotalPayInMoth[arrTotalPayInMoth.length-1]).toLocaleString('en')}`;
    inpTotalSum.value = totalSum.toLocaleString('en');
    inpOverPayment.value = overPayment.toLocaleString('en');
    inpOverPaymentInProcent.value = `${(payInProcent).toLocaleString('en')}% от суммы кредита`;

  }
});
