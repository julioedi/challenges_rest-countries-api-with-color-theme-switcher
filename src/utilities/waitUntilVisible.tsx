export default function waitUntilVisible(element: HTMLElement | null, options = {}) {
    return new Promise((resolve, reject) => {
        if (!element) {
            resolve(false)
            return
        }
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    observerInstance.disconnect();
                    resolve(entry.target);
                }
            });
        }, options);

        observer.observe(element);
    });
}
