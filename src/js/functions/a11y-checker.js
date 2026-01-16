(function() {
  'use strict';

  let errorCount = 0;


  function logError(element, message) {
    errorCount++;
    console.error(
      `[A11Y Error #${errorCount}] ${message}`,
      element
    );
  
    element.style.outline = '2px solid red';
    element.style.outlineOffset = '2px';
  }

 
  function checkImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        const className = img.className || '(без класу)';
        logError(img, `Зображення з класом "${className}" не має атрибута alt`);
      }
      else if (img.alt === '' && img.getAttribute('role') !== 'presentation') {
        const className = img.className || '(без класу)';
        console.warn(
          `[A11Y Warning] Зображення з класом "${className}" має порожній alt. Якщо це декоративне зображення, додайте role="presentation"`,
          img
        );
      }
    });
  }

 
  function checkButtons() {
    const buttons = document.querySelectorAll('button, [role="button"]');
    
    buttons.forEach(button => {
      const hasText = button.textContent.trim().length > 0;
      const hasAriaLabel = button.hasAttribute('aria-label');
      const hasAriaLabelledby = button.hasAttribute('aria-labelledby');
      const hasTitle = button.hasAttribute('title');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        const className = button.className || '(без класу)';
        const tagName = button.tagName.toLowerCase();
        logError(
          button,
          `Кнопка ${tagName} з класом "${className}" не має доступного тексту (відсутні textContent, aria-label, aria-labelledby або title)`
        );
      }
    });
  }


  function checkFormInputs() {
    const inputs = document.querySelectorAll('input:not([type="hidden"]), select, textarea');
    
    inputs.forEach(input => {
      const hasLabel = input.id && document.querySelector(`label[for="${input.id}"]`);
      const hasAriaLabel = input.hasAttribute('aria-label');
      const hasAriaLabelledby = input.hasAttribute('aria-labelledby');
      const hasTitle = input.hasAttribute('title');
      const isWrappedInLabel = input.closest('label');
      
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby && !hasTitle && !isWrappedInLabel) {
        const className = input.className || '(без класу)';
        const type = input.type || input.tagName.toLowerCase();
        logError(
          input,
          `Поле ${type} з класом "${className}" не має пов'язаного label або aria-атрибута`
        );
      }
    });
  }

  function checkLinks() {
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const hasText = link.textContent.trim().length > 0;
      const hasAriaLabel = link.hasAttribute('aria-label');
      const hasAriaLabelledby = link.hasAttribute('aria-labelledby');
      const hasTitle = link.hasAttribute('title');
      const hasImg = link.querySelector('img[alt]');
      
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle && !hasImg) {
        const className = link.className || '(без класу)';
        logError(
          link,
          `Посилання з класом "${className}" не має доступного тексту`
        );
      }
    });
  }

  function checkInteractiveElements() {
    const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio'];
    
    interactiveRoles.forEach(role => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      
      elements.forEach(element => {
        const isNativelyFocusable = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
        const hasTabindex = element.hasAttribute('tabindex');
        
        if (!isNativelyFocusable && !hasTabindex) {
          const className = element.className || '(без класу)';
          logError(
            element,
            `Елемент з role="${role}" та класом "${className}" не має tabindex (недоступний з клавіатури)`
          );
        }
      });
    });
  }


  function checkTables() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
      const hasTh = table.querySelector('th');
      const hasCaption = table.querySelector('caption');
      const hasAriaLabel = table.hasAttribute('aria-label');
      const hasAriaLabelledby = table.hasAttribute('aria-labelledby');
      
      if (!hasTh) {
        const className = table.className || '(без класу)';
        logError(
          table,
          `Таблиця з класом "${className}" не має елементів <th> для заголовків`
        );
      }
      
      if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
        const className = table.className || '(без класу)';
        console.warn(
          `[A11Y Warning] Таблиця з класом "${className}" не має <caption> або aria-атрибута для опису`,
          table
        );
      }
    });
  }

  function checkIframes() {
    const iframes = document.querySelectorAll('iframe');
    
    iframes.forEach(iframe => {
      if (!iframe.hasAttribute('title') && !iframe.hasAttribute('aria-label')) {
        const className = iframe.className || '(без класу)';
        logError(
          iframe,
          `iframe з класом "${className}" не має атрибута title або aria-label`
        );
      }
    });
  }

  function checkClickableElements() {
    const clickables = document.querySelectorAll('[onclick]');
    
    clickables.forEach(element => {
      const isButton = element.tagName === 'BUTTON';
      const isLink = element.tagName === 'A';
      const hasRole = element.hasAttribute('role');
      
      if (!isButton && !isLink && !hasRole) {
        const className = element.className || '(без класу)';
        const tagName = element.tagName.toLowerCase();
        logError(
          element,
          `Елемент ${tagName} з класом "${className}" має onclick, але не має відповідного role (наприклад, role="button")`
        );
      }
    });
  }


  function checkSemanticStructure() {
    const hasMain = document.querySelector('main, [role="main"]');
    const hasNav = document.querySelector('nav, [role="navigation"]');
    
    if (!hasMain) {
      console.warn('[A11Y Warning] На сторінці відсутній елемент <main> або role="main"');
    }
    
    const h1Elements = document.querySelectorAll('h1');
    if (h1Elements.length === 0) {
      console.warn('[A11Y Warning] На сторінці відсутній заголовок <h1>');
    } else if (h1Elements.length > 1) {
      console.warn('[A11Y Warning] На сторінці більше одного заголовка <h1>');
    }
  }


  function runAccessibilityCheck() {
    console.log('%c🔍 Запуск перевірки доступності...', 'font-size: 16px; font-weight: bold; color: #0066cc;');
    console.log('─────────────────────────────────────────');
    
    errorCount = 0;
    

    checkImages();
    checkButtons();
    checkFormInputs();
    checkLinks();
    checkInteractiveElements();
    checkTables();
    checkIframes();
    checkClickableElements();
    checkSemanticStructure();
    
    console.log('─────────────────────────────────────────');
    if (errorCount === 0) {
      console.log('%c✅ Перевірка завершена! Критичних помилок доступності не знайдено.', 'font-size: 14px; font-weight: bold; color: #00aa00;');
    } else {
      console.log(`%c❌ Перевірка завершена! Знайдено ${errorCount} помилок доступності.`, 'font-size: 14px; font-weight: bold; color: #cc0000;');
      console.log('%cПроблемні елементи виділені червоним контуром на сторінці.', 'color: #666;');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAccessibilityCheck);
  } else {
    runAccessibilityCheck();
  }
  window.checkAccessibility = runAccessibilityCheck;
  
  console.log('%cℹ️ Для повторного запуску перевірки виконайте: checkAccessibility()', 'color: #0066cc;');

})();