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
