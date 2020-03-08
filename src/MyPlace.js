import './css/my-place.css'
import { Map } from './js/UI/Map'


class LoadedPlace {
    constructor(coordinates, address) {
        new Map(coordinates)
        const headerTitleElement = document.querySelector('header h1')
        headerTitleElement.textContent = address
    }
}

// built in constructor function, look it up
const url = new URL(location.href)
const queryParams = url.searchParams
const coords = {
    lat: parseFloat(queryParams.get('lat')),
    lng: parseFloat(queryParams.get('lng'))
}
const address = queryParams.get('address')
new LoadedPlace(coords, address)