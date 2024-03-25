const birthday = "23.05.1981";

const user = {
  name: "Michael Herman",
  city: "Jyväskylä",
  birthdate: birthday,
  getBirthday: function() {
    return birthday;
  },
  setName: function(getName) {
    this.name = getName;
  },
  setCity: function(getLocation) {
    this.city = getLocation;
  }
};

console.log(`${user.name} lives in ${user.city} and was born on ${user.birthdate}`);