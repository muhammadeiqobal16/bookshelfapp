document.addEventListener(`DOMContentLoaded`, function(){

    const submitForm = document.getElementById(`submitForm`);
    const searchForm = document.getElementById(`searchForm`);
    const inputYear = document.getElementById(`inputYear`);
    const allBooks = [];
    const STORAGE_KEY = `bookshelf-apps`;

    searchForm.addEventListener(`submit`, function(event){
        const inputSearch = document.getElementById(`inputSearch`).value.toLowerCase();
        const searchResultShelf = document.getElementById(`searchResultShelf`);
        searchResultShelf.innerHTML = ``;

        for(let book of allBooks){
            if(book.title.toLowerCase().includes(inputSearch)){
                const resultBook = createBookElement(book);
                searchResultShelf.append(resultBook);
            };
        };
        event.preventDefault();
    });

    submitForm.addEventListener(`submit`, function(event){
        addNewBook();
        event.preventDefault();
    });

    inputYear.addEventListener(`input`, function(){
        const amountTypedChar = inputYear.value.length;
        const maxCharAmount = inputYear.maxLength;
        const remainCharUpdate = maxCharAmount - amountTypedChar;
      
        if(remainCharUpdate <= -1){
            const finalValue = [...inputYear.value].splice(0, 4);
            inputYear.value = finalValue.join(``);
        };
    });

    const addNewBook = function(){
        const inputId = +new Date();
        const inputTitle = document.getElementById(`inputTitle`).value;
        const inputAuthor = document.getElementById(`inputAuthor`).value;
        const inputYear = document.getElementById(`inputYear`).value;
        const inputStatus = (() => document.getElementById(`inputStatus`).checked ? true : false)();

        const newBook = dataMerging(inputId, inputTitle, inputAuthor, inputYear, inputStatus);

        allBooks.push(newBook);

        rendering();

        clearInput(inputTitle, inputAuthor, inputYear);
    };

    const dataMerging = function(id, title, author, year, status){
        return {id, title, author, year, status};
    };

    const rendering = function(){
        console.log(allBooks);
        saveData();

        const unfinishedShelf = document.getElementById(`unfinishedShelf`);
        unfinishedShelf.innerHTML = ``;

        const finishedShelf = document.getElementById(`finishedShelf`);
        finishedShelf.innerHTML = ``;

        for(let book of allBooks){
            const newBookElement = createBookElement(book);
            book.status === true ? finishedShelf.append(newBookElement) : unfinishedShelf.append(newBookElement);
        };
    };

    const clearInput = function(title, author, year){
        document.getElementById(`inputTitle`).value = ``;
        document.getElementById(`inputAuthor`).value = ``;
        document.getElementById(`inputYear`).value = ``;
        if(document.getElementById(`inputStatus`).checked === true){
            document.getElementById(`inputStatus`).checked = false;
        };
    };

    const createBookElement = function(book){
        const bookTitle = document.createElement(`h3`);
        bookTitle.innerText = book.title;

        const bookAuthor = document.createElement(`p`);
        bookAuthor.innerText = book.author;

        const bookYear = document.createElement(`p`);
        bookYear.innerText = book.year;

        const textDiv = document.createElement(`div`);
        textDiv.append(bookTitle, bookAuthor, bookYear);

        const moveBtn = document.createElement(`img`);
        moveBtn.setAttribute(`src`, `img/icon/arrow-left-right.svg`);
        moveBtn.addEventListener(`click`, function(){
            moveBook(book);
        });

        const deleteBtn = document.createElement(`img`);
        deleteBtn.setAttribute(`src`, `img/icon/x-lg.svg`);
        deleteBtn.addEventListener(`click`, function(){
            deleteBook(book);
        });

        const actionDiv = document.createElement(`div`);
        actionDiv.classList.add(`actionDiv`, `flex`);
        actionDiv.append(moveBtn, deleteBtn);

        const bookElement = document.createElement(`div`);
        bookElement.classList.add(`flex`, `bookElement`);
        bookElement.append(textDiv, actionDiv);

        return bookElement;
    };

    const moveBook = function(book){
        const command = `move`;
        confirmBox(command, book);
    };

    const deleteBook = function(book){
        const command = `delete`;
        confirmBox(command, book);
    };

    const confirmBox = function(command, param){
        const confirmText = document.createElement(`p`);
        if(command === `move`){
            if(param.status){
                confirmText.innerText = `Move ${param.title} to Unfinished Shelf?`;
            }else{
                confirmText.innerText = `Move ${param.title} to Finished Shelf?`;
            }
        }else{
            if(param.status){
                confirmText.innerText = `Delete ${param.title} from Finished Shelf?`;
            }else{
                confirmText.innerText = `Delete ${param.title} from Unfinished Shelf?`;
            }
        };

        const yesBtn = document.createElement(`button`);
        yesBtn.innerText = `Yes`;
        yesBtn.addEventListener(`click`, function(){
            if(command === `move`){
                for(let book of allBooks){
                    if(book.id == param.id){
                        book.status === true ? book.status = false : book.status = true;
                    }else{
                        book.status = book.status;
                    }
                    rendering();
                };
                document.body.removeChild(blockingDiv);
                document.getElementById(`searchResultShelf`).innerHTML = ``;
            }else if(command === `delete`){
                for(let bookIndex in allBooks){
                    allBooks[bookIndex].id == param.id ? allBooks.splice(bookIndex, 1) : null;
                };
                rendering();
                document.body.removeChild(blockingDiv);
                document.getElementById(`searchResultShelf`).innerHTML = ``;
            }
        });

        const noBtn = document.createElement(`button`);
        noBtn.innerText = `No`;
        noBtn.addEventListener(`click`, function(){
            document.body.removeChild(blockingDiv);
            document.getElementById(`searchResultShelf`).innerHTML = ``;
        });

        const actionDiv = document.createElement(`div`);
        actionDiv.classList.add(`confirmBtnDiv`, `flex`);
        actionDiv.append(yesBtn, noBtn);
        
        const confirmDiv = document.createElement(`div`);
        confirmDiv.classList.add(`confirmDiv`, `flex`);
        confirmDiv.append(confirmText, actionDiv);

        const blockingDiv = document.createElement(`div`);
        blockingDiv.classList.add(`blockingDiv`, `flex`);
        blockingDiv.append(confirmDiv);

        document.body.append(blockingDiv);
    };
    
    const saveData = function(){
        const parsed = JSON.stringify(allBooks);
        localStorage.setItem(STORAGE_KEY, parsed);
    };

    const storageExist = function(){
        if(typeof(Storage)===undefined){
            return false;
        }
        return true;
    };

    const loadData = function(){
        const grabbedStorageDatas = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(grabbedStorageDatas);
        console.log(data);

        if(data !== null){
            for(let book of data){
                allBooks.push(book);
            };
        };
        rendering();
    };

    if(storageExist()){
        loadData();
    };
});