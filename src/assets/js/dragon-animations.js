import { gsap } from 'gsap';

export class DragonAnimations {
    static createDragonsSwayAnimation(dragonsElement, spinDuration = 2, settleDuration = 1) {
        if (!dragonsElement) return null;

        gsap.killTweensOf(dragonsElement);

        dragonsElement.style.transform = 'translate(-50%, -50%)';
        dragonsElement.style.left = '50%';
        dragonsElement.style.top = '50%';

        gsap.set(dragonsElement, {
            transformOrigin: "center center",
            zIndex: 60
        });

        dragonsElement.style.animation = 'none';

        const totalDuration = spinDuration + settleDuration;

        const swayTimeline = gsap.timeline({
            onComplete: () => {
                this.startDragonsPulsation(dragonsElement);
            }
        });

        const segmentDuration = totalDuration / 3;

        swayTimeline
            .to(dragonsElement, {
                scale: 1.1,
                duration: segmentDuration,
                ease: "sine.inOut"
            })
            .to(dragonsElement, {
                scale: 0.9,
                duration: segmentDuration,
                ease: "sine.inOut"
            })
            .to(dragonsElement, {
                scale: 1,
                duration: segmentDuration,
                ease: "sine.inOut",
                onComplete: () => {
                    dragonsElement.style.transform = 'translate(-50%, -50%)';
                }
            });

        return swayTimeline;
    }

    static startDragonsPulsation(dragonsElement) {
        if (!dragonsElement) return null;

        if (dragonsElement._pulsationActive) return;

        dragonsElement._pulsationActive = true;

        dragonsElement.style.transform = 'translate(-50%, -50%)';
        dragonsElement.style.left = '50%';
        dragonsElement.style.top = '50%';

        gsap.set(dragonsElement, {
            zIndex: 60
        });

        const pulsationTimeline = gsap.timeline({
            repeat: -1,
            yoyo: true,
            onComplete: () => {
                dragonsElement._pulsationActive = false;
            }
        });

        gsap.set(dragonsElement, {
            transformOrigin: "center center"
        });

        pulsationTimeline
            .to(dragonsElement, {
                scale: 1.08,
                filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.7)) drop-shadow(0 0 20px rgba(255, 165, 0, 0.6)) brightness(1.5)',
                duration: 1,
                ease: "sine.inOut"
            })
            .to(dragonsElement, {
                scale: 1,
                filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 12px rgba(218, 165, 32, 0.3)) brightness(1.3)',
                duration: 1,
                ease: "sine.inOut"
            });

        return pulsationTimeline;
    }
}
