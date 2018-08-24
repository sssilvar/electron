// Modules
const {ipcRenderer} = require('electron')
const items = require('./items')

// navigate selected item with up/down keys
$(document).keydown((e) => {
    switch (e.key) {
        case 'ArrowUp':
            items.changeItem('up')
            break;
    
        case 'ArrowDown':
            items.changeItem('down')
            break;
    }
})

// Show add modal
$('.open-add-modal').click(() => {
    $('#add-modal').addClass('is-active')
})

// Show add modal
$('.close-add-modal').click(() => {
    $('#add-modal').removeClass('is-active')
})

// Handle add-modal submission
$('#add-button').click(() => {
    // Get URL from input
    let itemURL = $('#item-input').val()
    if(itemURL) {
        // Disable input element
        $('#item-input').prop('disabled', true)
        $('#add-button').addClass('is-loading')
        $('.close-add-modal').addClass('is-disabled')

        // Send it trough IPC
        ipcRenderer.send('new-item', itemURL)
    }
})

// Trigger click event from hiting enter in the input field
$('#item-input').keyup((e) => {
    if (e.key == 'Enter') {
        $('#add-button').click()
    }
})

// Filter saved data
$('#search').keyup((e) => {
    // Get current search
    let filter = $(e.currentTarget).val().toLocaleLowerCase()
    $('.read-item').each((i, el) => {
        $(el).text().toLocaleLowerCase().includes(filter) ? $(el).show(): $(el).hide()
    })
})


// Listen from main
ipcRenderer.on('new-item-success', (e, item) => {
    
    // Add and save item
    items.toReadItems.push(item)
    items.saveItems()
    items.addItem(item)
    console.log('Items: ' + items.toReadItems)
    
    $('.close-add-modal').click()
    $('#item-input').prop('disabled', false).val('')
    $('#add-button').removeClass('is-loading')
    $('.close-add-modal').removeClass('is-disabled')

    // Set as selected if first
    if (items.toReadItems.length === 1){
        $('.read-item:first()').addClass('is-active')
    }
})

// Add items when load
if (items.toReadItems.length){
    items.toReadItems.forEach(items.addItem)
    $('.read-item:first()').addClass('is-active')
}