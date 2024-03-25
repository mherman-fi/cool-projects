class SpeedCalculator {
    constructor(hours, minutes, seconds, kilometers) {
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
      this.kilometers = kilometers;
    }
  
    get kmhPace() {
      return this.#calcKmhPace();
    }
    
    get minkmPace() {
      return this.#calcMinkmPace();
    }

    #calcKmhPace() {
      const totalSeconds = this.hours * 3600 + this.minutes / 60 + this.seconds;
       const kmh = this.kilometers / (totalSeconds / 3600);
      return kmh
    }
  
    #calcMinkmPace() {
      const totalSeconds = (this.hours * 3600) + (this.minutes / 60) + this.seconds;
      this.paceMin = Math.floor(totalSeconds / this.kilometers);
      this.paceSec = Math.round((totalSeconds / this.kilometers - this.paceMin) * 60);
    }
  
  }
  const submitForm = (hours, minutes, seconds, kilometers) => {
    const x =  new SpeedCalculator(hours, minutes, seconds, kilometers);
    console.log(x.kmhPace + " km/h");
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = x.kmhPace.toFixed(2) + " km/h"; 
  }