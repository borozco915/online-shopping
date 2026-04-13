(function () {
  const modal = document.getElementById('product-modal');

  if (!modal) {
    return;
  }

  const triggerSelector = '[data-product-trigger]';
  const closeSelector = '[data-close-modal]';
  const title = document.getElementById('product-modal-title');
  const price = document.getElementById('product-modal-price');
  const description = document.getElementById('product-modal-description');
  const image = document.getElementById('product-modal-image');
  const form = document.getElementById('product-modal-form');
  const detailLink = document.getElementById('product-modal-link');
  const sizes = document.getElementById('product-modal-sizes');
  const selectedSizeInput = document.getElementById('product-modal-selected-size');
  const selectedSizeLabel = document.getElementById('selected-size-label');
  const spinStage = document.getElementById('spin-stage');
  const spinRange = document.getElementById('spin-range');
  const spinToggle = document.getElementById('spin-toggle');

  let autoSpinTimer = null;
  let currentAngle = 0;

  function setSpin(angle) {
    currentAngle = Number(angle);
    spinStage.style.setProperty('--spin-angle', currentAngle + 'deg');
    spinRange.value = String(currentAngle);
  }

  function stopAutoSpin() {
    if (autoSpinTimer) {
      window.clearInterval(autoSpinTimer);
      autoSpinTimer = null;
      spinToggle.textContent = 'Auto Spin';
      spinToggle.classList.remove('is-active');
    }
  }

  function startAutoSpin() {
    stopAutoSpin();
    spinToggle.textContent = 'Pause Spin';
    spinToggle.classList.add('is-active');

    autoSpinTimer = window.setInterval(function () {
      setSpin((currentAngle + 4) % 360);
    }, 40);
  }

  function resetSizeSelection(sizeList) {
    sizes.innerHTML = '';
    selectedSizeInput.value = '';
    selectedSizeLabel.textContent = 'Select a size';

    sizeList.forEach(function (size, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'size-option';
      button.textContent = size;
      button.setAttribute('data-size', size);

      button.addEventListener('click', function () {
        sizes.querySelectorAll('.size-option').forEach(function (option) {
          option.classList.remove('is-selected');
        });

        button.classList.add('is-selected');
        selectedSizeInput.value = size;
        selectedSizeLabel.textContent = 'Size ' + size + ' selected';
      });

      if (index === 1 || (index === 0 && sizeList.length === 1)) {
        button.click();
      }

      sizes.appendChild(button);
    });
  }

  function openModal(dataset) {
    title.textContent = dataset.name;
    price.textContent = '$' + dataset.price;
    description.textContent = dataset.description || 'Premium jersey built for match day and everyday wear.';
    image.src = dataset.img;
    image.alt = dataset.name;
    form.action = '/cart/' + dataset.id;
    detailLink.href = '/product/' + dataset.id;

    resetSizeSelection((dataset.sizes || '').split(',').filter(Boolean));
    setSpin(0);
    stopAutoSpin();

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    stopAutoSpin();
  }

  document.querySelectorAll(triggerSelector).forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openModal(trigger.dataset);
    });
  });

  modal.querySelectorAll(closeSelector).forEach(function (button) {
    button.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });

  spinRange.addEventListener('input', function (event) {
    stopAutoSpin();
    setSpin(event.target.value);
  });

  spinToggle.addEventListener('click', function () {
    if (autoSpinTimer) {
      stopAutoSpin();
      return;
    }

    startAutoSpin();
  });

  form.addEventListener('submit', function (event) {
    if (!selectedSizeInput.value) {
      event.preventDefault();
      selectedSizeLabel.textContent = 'Please choose a size';
    }
  });
})();
