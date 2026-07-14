let cars = [];

fetch('cars.json')
.then(res => res.json())
.then(data => {
  cars = data;
  renderCars(cars);
});

function renderCars(list){
  const container = document.getElementById('cars-container');

  container.innerHTML = list.map(car => `
    <div class="car-card">
      <img src="images/${car.image}" alt="${car.brand}">
      <div class="car-info">
        <h3>${car.brand} ${car.model}</h3>
        <p>Year: ${car.year}</p>
        <p>Price: $${car.price}</p>
        <p>Mileage: ${car.mileage} km</p>
      </div>
    </div>
  `).join('');
}

document.getElementById('search').addEventListener('input', e=>{
  const keyword = e.target.value.toLowerCase();
  renderCars(
    cars.filter(c => c.brand.toLowerCase().includes(keyword))
  );
});
