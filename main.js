// main.js
fetch('timeline.yaml')
  .then((response) => response.text())
  .then((yamlText) => {
    // Parse YAML into a JS object
    const data = jsyaml.load(yamlText);

    // ===== 1) Update Title and Description =====
    if (data.title) {
      const mainTitleEl = document.getElementById('mainTitle');
      if (mainTitleEl) mainTitleEl.textContent = data.title + " 📜";

      const navbarTitleEl = document.getElementById('navbarTitle');
      if (navbarTitleEl) navbarTitleEl.textContent = data.title;

      const heroTitleEl = document.getElementById('heroTitle');
      if (heroTitleEl) heroTitleEl.textContent = data.title;
    }

    if (data.description) {
      const heroDescEl = document.getElementById('heroDesc');
      if (heroDescEl) heroDescEl.textContent = data.description;
    }

    // ===== 2) Apply Colors from YAML as CSS variables =====
    if (data.background_color) {
      document.documentElement.style.setProperty('--background-color', data.background_color);
    }
    if (data.primary_color) {
      document.documentElement.style.setProperty('--primary-color', data.primary_color);
    }
    if (data.timeline_color) {
      document.documentElement.style.setProperty('--timeline-color', data.timeline_color);
    }
    if (data.title_color) {
      document.documentElement.style.setProperty('--title-color', data.title_color);
    }
    if (data.time_color) {
      document.documentElement.style.setProperty('--time-color', data.time_color);
    }
    if (data.text_color) {
      document.documentElement.style.setProperty('--text-color', data.text_color);
    }

    // ===== 3) Check for the Timeline Array =====
    const timelineContainer = document.getElementById('timelineContainer');
    if (!data.timeline || !Array.isArray(data.timeline)) {
      console.error("Error: 'timeline' array not found in timeline.yaml!");
      return;
    }

    // Clear any existing HTML in the container (just in case)
    timelineContainer.innerHTML = '';

    // Create a wrapper for the vertical timeline
    const timelineWrapper = document.createElement('div');
    timelineWrapper.classList.add('timeline'); // We'll style this in CSS

    // ===== 4) Build Each Timeline Entry =====
    data.timeline.forEach((item) => {
      // Create a timeline card
      const cardDiv = document.createElement('div');
      cardDiv.classList.add('timeline-card');

      // If there's an image, append it
      if (item.image && item.image.trim() !== '') {
        const imgEl = document.createElement('img');
        imgEl.src = item.image;
        // If there's a src link, make the image clickable
        if (item.src && item.src.trim() !== '') {
          imgEl.classList.add('card-image-clickable');
          imgEl.addEventListener('click', (e) => {
            e.stopPropagation(); // so the card doesn't also get clicked
            window.open(item.src, '_blank');
          });
        }
        cardDiv.appendChild(imgEl);
      }

      // Card content (ALWAYS visible)
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('card-content');

      // Title
      const titleEl = document.createElement('h3');
      titleEl.textContent = item.title || '';
      contentDiv.appendChild(titleEl);

      // Time
      const timeEl = document.createElement('div');
      timeEl.classList.add('time');
      timeEl.textContent = item.time || '';
      contentDiv.appendChild(timeEl);

      // Text
      const textEl = document.createElement('p');
      textEl.textContent = item.text || '';
      contentDiv.appendChild(textEl);

      // Append content to the card
      cardDiv.appendChild(contentDiv);

      // Append the card to the timeline wrapper
      timelineWrapper.appendChild(cardDiv);
    });

    // Finally, append the wrapper to the container
    timelineContainer.appendChild(timelineWrapper);

    // ===== 5) Optional: Add “Zoom” on the Card at Screen Center (Intersection Observer) =====
    // If you want that "pop" effect, uncomment the code below:
    /*
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    }, options);

    document.querySelectorAll('.timeline-card').forEach((card) => {
      observer.observe(card);
    });
    */
  })
  .catch((err) => {
    console.error('Error fetching or parsing timeline.yaml:', err);
  });
