const allArticles = [];

window.addEventListener('load', () => {
    fetch("https://ual-portal.herokuapp.com/knowledge?topics=('SJD','DEN','Airbus A320','United Economy','International Flight','UA 452','UA 338','Mexico','Denver, CO','Cabo San Lucas, MX')")
        .then(data => data.json())
        .then(response => {
            window.allArticles = response;
            renderArticles(response);
        })

    document.querySelector('#searchBar').addEventListener('keyup', (event) => {
        if (event.target.value.length > 2) {
            fetch('https://ual-portal.herokuapp.com/knowledgesearch?searchstring=' + event.target.value)
                .then(data => data.json())
                .then(response => {
                    renderArticles(response);
                })
        } else {
            renderArticles(window.allArticles);
        }
    })
})

function deleteItems() {
    if (document.querySelector('.border-0') != null) {
        document.querySelectorAll('.border-0').forEach((element, index) => {
            element.remove();
        })
    }
}

function renderArticles(articles) {
    deleteItems();
    articles.records.map(item => {
        let node = document.createElement('div');
        node.classList.add('card');
        node.classList.add('border-0');
        let innernode = document.createElement('div');
        innernode.classList.add('card-body');
        let heading = document.createElement('h5');
        heading.innerHTML = item.Title;
        innernode.appendChild(heading);
        let description = document.createElement('p');
        description.innerHTML = item['FAQ_Answer__c'];
        innernode.appendChild(description);
        node.appendChild(innernode);

        document.querySelector('#searchcontainer').appendChild(node);
    })
}
