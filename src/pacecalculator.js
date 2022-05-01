;(function () {
  const form = document.getElementById("calc-form")
  const results = document.getElementById("results")
  const errors = document.getElementById("form-error")
  const intro = document.getElementById("intro")

  /**
   * Display a form validation error
   *
   * @param   {String}  msg  The validation message
   * @return  {Boolen}       Returns false
   */
  function errorMessage(msg) {
    errors.innerHTML = msg
    errors.style.display = ""
    return false
  }

  // Takes a VO2 measurement and converts it to a velocity.
  function VO2ToVel(VO2) {
    return 29.54 + 5.000663 * VO2 - 0.007546 * VO2 * VO2
  }

  // Takes a time in minutes and uses EQ 2 to convert it to a percent of VO2 maximum.
  function timeToPercentVO2Max(mins) {
    return (
      0.8 +
      0.1894393 * Math.exp(-0.012778 * mins) +
      0.2989558 * Math.exp(-0.1932695 * mins)
    )
  }

  // Takes a velocity and converts it to a VO2 level.
  function velToVO2(vel) {
    return -4.6 + 0.182258 * vel + 0.000104 * vel * vel
  }
  // Convert speed to display
  function timeConvert(speed, checkYasso = false) {
    var resultKm
    var resultMile

    resultKm = (1 / speed) * 1000
    resultMile = (1 / speed) * 1609

    minsKm = Math.floor(resultKm)
    secsKm = Math.floor((resultKm - minsKm) * 60)
    minsMile = Math.floor(resultMile)
    secsMile = Math.floor((resultMile - minsMile) * 60)

    if (secsKm > 9) {
      sKmSep = ":"
    } else {
      sKmSep = ":0"
    }
    if (secsMile > 9) {
      sMSep = ":"
    } else {
      sMSep = ":0"
    }
    if (checkYasso == true) {
      return "" + minsMile + sMSep + secsMile + " per 800."
    } else {
      return "" + minsKm + sKmSep + secsKm + " / km"
    }
  }

  // Convert dropdown of race distance to km
  function raceToMiles(raceDist) {
    var miles
    switch (raceDist) {
      case "marathon":
        miles = 26.21875
        break
      case "halfmarathon":
        miles = 13.109375
        break
      case "10m":
        miles = 10
        break
      case "10k":
        miles = 6.21371192
        break
      case "5m":
        miles = 5
        break
      case "5k":
        miles = 3.10685596
        break
      case "3k":
        miles = 1.864113576
        break
      case "1k":
        miles = 0.621371
        break
      case "1m":
        miles = 1
        break
      case "1500":
        miles = 0.932056788
        break
    }

    return miles * 1609
  }

  /**
   * Hide the results and reset the form
   */
  function resetForm(e) {
    if ((e.target.id = "rs")) {
      e.preventDefault()
      results.style.display = "none"
      form.style.display = ""
      intro.style.display = ""
      //form.reset()
    }
  }
  /**
   * Convert time to seconds
   *
   * @param   {Int}  m  Minutes
   * @param   {Int}  s  Seconds
   * @return  {Int}     The time in seconds
   */
  function toMinutes(h, m, s) {
    h = parseInt(h) || 0
    m = parseInt(m) || 0
    s = parseInt(s) || 0
    return h * 60 + m + s / 60
  }

  /**
   * Display the results on the page
   *
   */
  function displayResults({
    velEasyDisplay,
    velMaxDisplay,
    velTempoDisplay,
    velSpeedDisplay,
    velLongDisplay,
  }) {
    results.innerHTML = `
    <h5 class="mb-4 font-bold">Rekomendasi pace lari kamu</h5>
    <div class="flex flex-col space-y-4">
    <div class=" p-2 border-2 border-black text-lg">${velEasyDisplay}</div> 
  <div class=" p-2 border-2 border-black text-lg">${velMaxDisplay}</div>
  <div class=" p-2 border-2 border-black text-lg">${velTempoDisplay}</div>
  <div class=" p-2 border-2 border-black text-lg">${velSpeedDisplay}</div>
  <div class=" p-2 border-2 border-black text-lg">${velLongDisplay}</div>
  <div class=" p-2 border-2 border-black text-lg">${velYassoDisplay}</div>
  </div>
  
  <a href="#" id="revise" class="mt-8 underline block">Revisi</a>
  
  
  `

    results.style.display = ""
    form.style.display = "none"
    errors.style.display = "none"
    intro.style.display = "none"
  }

  /**
   * Handle form submit
   * Gather/calculate data from form input and display results
   */
  function handleSubmit(e) {
    e.preventDefault()
    let data = {
      race: form.race.value,
      finishTime: toMinutes(
        form.finish_time_hr.value,
        form.finish_time_min.value,
        form.finish_time_sec.value
      ),
    }

    if (!data.race) {
      return errorMessage("Kamu belum memilih jarak lari")
    }
    if (!data.finishTime) {
      return errorMessage("Isi waktu terbaik kamu.")
    }

    data.distance = raceToMiles(data.race)
    data.speed = data.distance / data.finishTime
    data.v02Max = velToVO2(data.speed) / timeToPercentVO2Max(data.finishTime)
    data.velEasy = VO2ToVel(data.v02Max * 0.7)
    data.velTempo = VO2ToVel(data.v02Max * 0.88)
    data.velMaximum = VO2ToVel(data.v02Max)
    data.velSpeed = VO2ToVel(data.v02Max * 1.1)
    data.velxlong = VO2ToVel(data.v02Max * 0.6)

    data.velEasyDisplay = `<div class="flex justify-between"><span>Easy run</span><strong>${timeConvert(
      data.velEasy
    )} </strong></div>`
    data.velTempoDisplay = `<div class="flex justify-between"><span>Tempo run</span><strong> ${timeConvert(
      data.velTempo
    )}</strong></div>`
    data.velMaxDisplay = `<div class="flex justify-between"><span>VO2-max</span><strong> ${timeConvert(
      data.velMaximum
    )}</strong></div>`
    data.velSpeedDisplay = `<div class="flex justify-between"><span>Speed form</span><strong> ${timeConvert(
      data.velSpeed
    )}</strong></div>`
    data.velLongDisplay = `<div class="flex justify-between"><span>Long run</span><strong> ${timeConvert(
      data.velxlong
    )}</strong></div>`

    //console.log(data);

    displayResults(data)
  }

  /**
   * Keep unit select fields in sync
   * Changing one changes both
   */
  function handleChange(e) {
    let sel = "select.unit"
    if (e.target.matches(sel)) {
      let val = e.target.value
      document.querySelectorAll(sel).forEach(s => (s.value = val))
    }
    // Hide errors
    errors.style.display = "none"
  }

  // Add Event Listeners
  form.addEventListener("submit", handleSubmit)
  form.addEventListener("change", handleChange)
  results.addEventListener("click", resetForm, true)
})()
