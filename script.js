const mealsEl = document.getElementById('meals')
const favoriteContainer = document.getElementById('fav-meals')
const mealPopup = document.getElementById('meal-popup')
const popupCloseBtn = document.getElementById('close-popup')

const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')

getRandomMeal()
fetchFavMeals()

async function getRandomMeal() {
	const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
	const respData = await resp.json()
	const randomMeal = respData.meals[0]
	addMeal(randomMeal, true)
}
async function getMealById(id) {
	const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id)
	const respData = await resp.json()
	const meal = respData.meals[0]
	return meal
}
async function getMealsBySearch(term) {
	const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term)
	const respData = await resp.json()
	const meals = respData.meals
	return meals
}

function addMeal(mealData, random = false) {
	const meal = document.createElement('div')
	meal.classList.add('meal')
	meal.innerHTML = `
			<div class="meal-header">
				${random ? `
				<span class="random"> Random Recipe </span>	
				` : ''}
					<img src="${mealData.strMealThumb}">
						
			</div>
			<div class="meal-body">
				<h4>${mealData.strMeal}</h4>
				<button class="fav-btn">like</button>
			</div>
	`
	const btn = meal.querySelector('.meal-body .fav-btn')

	btn.addEventListener('click', () => {
		if (btn.classList.contains('active')) {
			removeMealFromLS(mealData.idMeal)
			btn.classList.remove('active')
		}
		else {
			addMealToLS(mealData.idMeal)
			btn.classList.add('active')
		}

		fetchFavMeals()
	})


	mealsEl.appendChild(meal)
}

function addMealToLS(mealId) {
	const mealIds = getMealsFromLS()
	localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))
}

function removeMealFromLS(mealId) {
	const mealIds = getMealsFromLS()
	localStorage.setItem('mealIds', JSON.stringify(mealIds.filter((id) => id !== mealId)))
}


function getMealsFromLS() {
	const mealIds = JSON.parse(localStorage.getItem('mealIds'))
	return mealIds === null ? [] : mealIds
}
async function fetchFavMeals() {
	favoriteContainer.innerHTML = ''
	const mealIds = getMealsFromLS()
	const meals = []
	for (let i = 0; i < mealIds.length; i++) {
		const mealId = mealIds[i]
		meal = await getMealById(mealId)
		addMealToFav(meal)
	}
}

function addMealToFav(mealData) {

	const favMeal = document.createElement('li')
	favMeal.innerHTML = `
			<img src="${mealData.strMealThumb}"
				alt="">
			<span>
				${mealData.strMeal}
			</span>
			<button class="clear">c</button>
	`
	const btn = favMeal.querySelector('.clear')
	btn.addEventListener('click', () => {
		removeMealFromLS(mealData.idMeal)
		fetchFavMeals()
	})
	favoriteContainer.appendChild(favMeal)
}

searchBtn.addEventListener('click', async () => {
	mealsEl.innerHTML = ''
	const search = searchTerm.value

	const meals = await getMealsBySearch(search)
	if (meals) {
		meals.forEach(meal => {
			addMeal(meal)
		})
	}
	searchTerm.value = ''
})
popupCloseBtn.addEventListener('click', () => {
	mealPopup.classList.add('hidden')
})