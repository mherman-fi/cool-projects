class Person {
    constructor(name, age, phone, email) {
      this.name = name;
      this.age = age;
      this.phone = phone;
      this.email = email;
    }
  
    age() {
      this.age += 1;
    }
  }

const person1 = new Person("Michael Herman", 41, "123-456-7890", "hermi@esim.fi");
const person2 = new Person("Kirsi Räsänen", 38, "098-765-4321", "raski@esim.com");
const person3 = new Person("Jani Ilomäki", 44, "111-222-3333", "iloja@esim.com");

console.log(person1.name);  // Michael Herman
console.log(person2.age);   // 38
console.log(person3.phone); // 111-222-3333
console.log(person1.email); // hermi@esim.fi