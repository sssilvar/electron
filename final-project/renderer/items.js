exports.toReadItems = JSON.parse(localStorage.getItem('toReadItems')) || []

exports.saveItems = () => {
    localStorage.setItem('toReadItems', JSON.stringify(this.toReadItems))
}

exports.changeItem = (direction) => {
    // Get current selected item
    let activeItem = $('.read-item.is-active')

    // Check direction and get next or previous
    let newItem  = (direction === 'down') ? activeItem.next('.read-item') : activeItem.prev('.read-item')

    // Set as active
    if (newItem.length) { 
        activeItem.removeClass('is-active')
        newItem.addClass('is-active')
    }

}

exports.openItem = () => {
    // In case there's no items
    if (!this.toReadItems.length) return

    // Get selected item (double click)
    let targetItem = $('.read-item.is-active')
    let contentURL = encodeURIComponent(targetItem.data('url'))

    // Reader window URL
    let readerWinURL = `file://${__dirname}/reader.html?url=${contentURL}`

    // Open site
    let readerWin = window.open(readerWinURL, targetItem.data('title'))

}

exports.selectItem = (e) => {
    $('.read-item').removeClass('is-active')
    $(e.currentTarget).addClass('is-active')
}

exports.addItem = (item) => {
    // Hide message of "No items"
    $('#no-items').hide()

    // New item HTML
    let itemHTML = `<a class="panel-block read-item" data-url="${item.url}" data-title="${item.title}">
                        <figure class="image has-shadow is-64x64 thumb">
                            <img src="${item.screenshot}">
                        </figure>
                        <h2 class="title is-4 column">${item.title}</h2>
                    </a>`
    // Append to list
    $('#read-list').append(itemHTML)

    // Attach select event listener
    $('.read-item')
        .off('click, dblclick')
        .on('click', this.selectItem)
        .on('dblclick', this.openItem)
}