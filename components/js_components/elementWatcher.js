// ---------------------------------------------------------------------------------------------------------------
// Цей скрипт відповідає за спостерігача для анімацій.
// ---------------------------------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------------------------------------
// Для використання цього скрипта потрібно додавати в елемент який ми маємо відслідкувати атрибу --- data-watch="true"
// ---------------------------------------------------------------------------------------------------------------

export function initializeElementWatcher() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log(`Element watcher --- Готовий до роботи.`);

        // ---------------------------------------------------------------------------------------------------------------
        // Опції для IntersectionObserver
        const observerOptions = {
            root: null, // Використовуємо viewport як корінь
            rootMargin: '0px', // Немає додаткових відступів
            threshold: 0.1 // Елемент вважається видимим, якщо 10% його площі видимі
        };
        // ---------------------------------------------------------------------------------------------------------------

        // ---------------------------------------------------------------------------------------------------------------
        // Функція зворотного виклику для IntersectionObserver
        // ---------------------------------------------------------------------------------------------------------------
        const observerCallback = (entries) => {
            entries.forEach(entry => {
                const element = entry.target; // Елемент, за яким спостерігаємо
                if (entry.isIntersecting) {
                    // Якщо елемент видимий, додаємо клас і виводимо повідомлення в консоль
                    element.classList.add('_watcher--view');
                    console.log(`Додано клас _watcher--view до елемента з класами: ${element.className}`);
                } else {
                    // Якщо елемент не видимий, видаляємо клас і виводимо повідомлення в консоль
                    element.classList.remove('_watcher--view');
                    console.log(`Видалено клас _watcher--view з елемента з класами: ${element.className}`);
                }
            });
        };

        // ---------------------------------------------------------------------------------------------------------------
        // Створюємо екземпляр IntersectionObserver з нашою функцією зворотного виклику та опціями
        // ---------------------------------------------------------------------------------------------------------------
        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // ---------------------------------------------------------------------------------------------------------------
        // Отримуємо всі елементи, які мають атрибут data-watch="true"
        // ---------------------------------------------------------------------------------------------------------------
        const elementsToWatch = document.querySelectorAll('[data-watch]');

        // ---------------------------------------------------------------------------------------------------------------
        // Починаємо спостерігати за кожним елементом
        // ---------------------------------------------------------------------------------------------------------------
        elementsToWatch.forEach(element => observer.observe(element));
    });
}
