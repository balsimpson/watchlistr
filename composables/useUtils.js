export const fuzzy = (items, key = "") => {
  return (query) => {
    let words = query.toLowerCase().split(" ");

    if (key) {
      return items.filter((item) => {
        let normalizedTerm = item[key].toLowerCase();
  
        return words.every((word) => {
          return normalizedTerm.indexOf(word) > -1;
        });
      });
    } else {
      return items.filter((item) => {
        let normalizedTerm = item.toLowerCase();
  
        return words.every((word) => {
          return normalizedTerm.indexOf(word) > -1;
        });
      });

    }
  };
};

export const createSlug = (title, id) => {
  if (title && id) {
    // console.log('1');
    return (
      title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-') +
      '-' +
      id
    )
  } else if (title) {
    return (
      title
        .toLowerCase()
        .replace(/[^\w ]+/g, '-')
        .replace(/ /g, '-')
    )
  } else {
    console.log('no title or id', title, id)
  }
}

export const convertedStr = (str) => str
  .split("-") // split the string into an array of words
  .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize the first letter of each word
  .join(" "); // join the words back into a string with spaces between them

export const getPostDetails = (data) => {

  if (data && data.content) {
    // let title = data.content.find(element => element.type == "heading");
    // if (title && title.content) {
    //   title = title?.content[0]?.text || "";
    // } else {
    //   title = "";
    // }

    let description = data.content.find(element => element.type == "paragraph");
    let txt = "";
    if (description && description.content && description.content.length) {
      description.content.map(d => {
        txt += d.text;
      })

      description = txt;
    } else {
      description = "";
    }

    // let image = data.content.find(element => element.type == "image");
    let image = data.content.find(element => {
      if (element.attrs.src) {
        return element.attrs.src
      }
    });
    image = image?.attrs?.src || ""
    
    console.log('image', image);
    return { description, image }
  }
  // return
}

export const getRelativeTime = (timestamp) => {
  const date = new Date(timestamp);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = Date.now() - date;

  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  if (days > 7) {
    // return formatter.format(-days, 'day');
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  } else if (days > 14) {
    return formatter.format(-days, 'day');
  } else if (hours > 1) {
    return formatter.format(-hours, 'hour');
  } else if (minutes > 1) {
    return formatter.format(-minutes, 'minute');
  } else {
    console.log("else")
    return formatter.format(-seconds, 'second');
  }
}

export const observeElements = (elements) => {
  // Set up an intersection observer to detect when the elements are scrolled into view
  const options = {
    root: document.querySelector("#scrollArea"),
    rootMargin: "0px",
    threshold: 0
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      // Check if the element is within the window viewport
      if (entry.isIntersecting) {
        // Element is in view, do something with it here
        // console.log(entry)
        entry.target.classList.add("visible")
      } else {
        entry.target.classList.toggle("visible")
      }
    });
  });

  // Start observing the elements
  elements.forEach(element => observer.observe(element));
}