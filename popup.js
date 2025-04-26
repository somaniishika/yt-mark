// //initialization of bookmark button and the container to store
// //bookmark data
// let bookmarkButton = document.getElementById('bookmarkButton');
// let container = document.getElementById('container');

// //call to send message to content script on click
// bookmarkButton.onclick = () => {
//     sendMessage("bookmark", true);
// }

// //send message to content script with argument of message and its value
// function sendMessage(message, value) {
//     chrome.tabs.query({
//         active: true,
//         currentWindow: true
//     }, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {
//             [message]: value
//         });
//     });
// }

// //refresh popup on message receive of refresh
// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         if (request.refresh) {
//             location.reload();
//         }
//     }
// );

// //append content of chrome storage for bookmarks into container
// function layout() {
//     chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
//         if (result.youtubeBookmarks != undefined) {
//             let value = JSON.parse(result.youtubeBookmarks).value;
//             let youtubeLink = "https://www.youtube.com/watch?v=";
//             for (let i = 0; i < value.length; i++) {
//                 let time = "&t=" + value[i].time.minutes + "m" + value[i].time.seconds + "s";
//                 let div = document.createElement('div');
//                 let div2 = document.createElement('div');
//                 let button = document.createElement('button');
//                 let a = document.createElement('a');
//                 let a2 = document.createElement('a');
//                 a.innerHTML = value[i].title;
//                 a2.innerHTML = "DELETE";
//                 a.onclick = () => {
//                     let linkObj = {
//                         url: youtubeLink + value[i].url + time
//                     }
//                     sendMessage("link", linkObj);
//                 }
//                 a2.onclick = () => {
//                     deleteStorageEntry(i);
//                 }
//                 div.className = "main-div";
//                 div2.className = "title-div";
//                 button.className = "delete-div";
//                 div2.appendChild(a);
//                 button.appendChild(a2);
//                 div.appendChild(div2);
//                 div.appendChild(button);
//                 container.appendChild(div);
//             }
//         }
//     });
// }

// //delete bookmarks from chrome storage on user click of delete button
// function deleteStorageEntry(index) {
//     chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
//         let bookmarks = JSON.parse(result.youtubeBookmarks);

//         bookmarks.value.splice(index, 1);

//         chrome.storage.sync.set({
//             youtubeBookmarks: JSON.stringify(bookmarks)
//         });
//     });
//     location.reload();
// }

// //call to layout
// layout();

let bookmarkButton = document.getElementById('bookmarkButton');
let container = document.getElementById('container');

bookmarkButton.onclick = () => {
  sendMessage("bookmark", true);
};

function sendMessage(message, value) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      [message]: value
    });
  });
}

chrome.runtime.onMessage.addListener(function (request) {
  if (request.refresh) {
    location.reload();
  }
});

function layout() {
  chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
    if (result.youtubeBookmarks) {
      let value = JSON.parse(result.youtubeBookmarks).value;
      let youtubeLink = "https://www.youtube.com/watch?v=";

      value.forEach((bookmark, i) => {
        let time = `&t=${bookmark.time.minutes}m${bookmark.time.seconds}s`;

        let div = document.createElement('div');
        div.className = "main-div";

        // Title & input
        let titleDiv = document.createElement('div');
        titleDiv.className = "title-div";

        let input = document.createElement('input');
        input.type = "text";
        input.value = bookmark.title;

        titleDiv.appendChild(input);

        // Action buttons
        let actions = document.createElement('div');
        actions.className = "actions";

        let editBtn = document.createElement('button');
        editBtn.textContent = "Save";
        editBtn.className = "edit-btn";
        editBtn.onclick = () => {
          updateTitle(i, input.value);
        };

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteStorageEntry(i);

        let link = document.createElement('a');
        link.href = youtubeLink + bookmark.url + time;
        link.target = "_blank";
        link.textContent = "▶️";
        link.style.textDecoration = "none";
        link.style.marginRight = "8px";

        actions.appendChild(link);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        div.appendChild(titleDiv);
        div.appendChild(actions);

        container.appendChild(div);
      });
    }
  });
}

function deleteStorageEntry(index) {
  chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
    let bookmarks = JSON.parse(result.youtubeBookmarks);
    bookmarks.value.splice(index, 1);
    chrome.storage.sync.set({
      youtubeBookmarks: JSON.stringify(bookmarks)
    }, () => location.reload());
  });
}

function updateTitle(index, newTitle) {
  chrome.storage.sync.get(['youtubeBookmarks'], function (result) {
    let bookmarks = JSON.parse(result.youtubeBookmarks);
    bookmarks.value[index].title = newTitle;
    chrome.storage.sync.set({
      youtubeBookmarks: JSON.stringify(bookmarks)
    }, () => location.reload());
  });
}

layout();
