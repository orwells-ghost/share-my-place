import './css/app.css'
import './css/share-place.css'

import { Modal } from './js/UI/Modal'
import { Map } from './js/UI/Map'
import { getCoordsFromAddress, getAddressFromCoords } from './js/Utility/Location'

class PlaceFinder {
    constructor() {
        const addressForm = document.querySelector('form')
        const locateUserBtn = document.getElementById('locate-btn')
        
        this.shareBtn = document.getElementById('share-btn')

        locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this))
        this.shareBtn.addEventListener('click', this.sharePlaceHandler)
        addressForm.addEventListener('submit', this.findAddressHandler.bind(this))
    }

    async sharePlaceHandler() {
        const shareLinkInputElement = document.getElementById('share-link')
        if (!navigator.clipboard) {
            shareLinkInputElement.select()
            return
        }

        try {
            await navigator.clipboard.writeText(shareLinkInputElement.value)
            alert('Copied to clipboard')
        } catch (error) {
            console.log('Failed to copy to clipboard: ', error)
            shareLinkInputElement.select()
        }

    }

    selectPlace(coordinates, address) {
        if (this.map) {
            this.map.render(coordinates)
        } else {
            this.map = new Map(coordinates)
        }

        this.shareBtn.disabled = false
        const shareLinkInputElement = document.getElementById('share-link')
        shareLinkInputElement.value = `${location.origin}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${coordinates.lng}`
    }

    locateUserHandler() {
        if (!navigator.geolocation) {
            alert('Location feature is not available in your browser. Please use a more modern browser or manually entered an address.')
            return
        }

        const modal = new Modal('loading-modal-content', 'Loading location - please wait.')
        modal.show()

        navigator.geolocation.getCurrentPosition(
            async successResult => {
                const coordinates = {
                    lat: successResult.coords.latitude,
                    lng: successResult.coords.longitude
                }
                const address = await getAddressFromCoords(coordinates)
                modal.hide()
                this.selectPlace(coordinates, address)
            },
            error => {
                modal.hide()
                alert('Could not find your location. Please enter location manually.')
            })
    }

    async findAddressHandler() {
        event.preventDefault()
        const address = event.target.querySelector('input').value
        if (!address || address.trim().length === 0) {
            alert('Invalid address entered. Please try again.')
            return
        } else {
            const modal = new Modal(
                'loading-modal-content',
                'Loading location - please wait.'
            )
            modal.show()
            try {
                const coordinates = await getCoordsFromAddress(address)
                this.selectPlace(coordinates, address)
            } catch (error) {
                alert(error.message)
            }
            modal.hide()
        }
    }
}

new PlaceFinder()