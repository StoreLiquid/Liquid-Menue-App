import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

interface SwipeConfig {
  minDistance: number; // Minimale Distanz für einen Swipe
  maxTime: number;     // Maximale Zeit für einen Swipe (ms)
  showIndicators?: boolean; // Ob Swipe-Indikatoren angezeigt werden sollen
  edgeOnly?: boolean;  // Ob Swipes nur vom Rand erkannt werden sollen
}

/**
 * Hook für Swipe-basierte Navigation
 * Erkennt Swipe-Gesten nach links/rechts und navigiert entsprechend
 */
export default function useSwipeNavigation(config: SwipeConfig = { 
  minDistance: 10, // Sehr niedrige Schwelle für zuverlässige Erkennung
  maxTime: 2000,   // Extra lange Zeit für langsame Swipes
  showIndicators: true,
  edgeOnly: true   // Standard: Nur vom Rand wischen
}) {
  const router = useRouter();
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);
  
  // Touchstart Informationen
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchStartTime = useRef<number | null>(null);
  const isSwiping = useRef(false);
  const edgeSwipe = useRef(false);

  useEffect(() => {
    // Erstelle die Indikator-Elemente, wenn sie gezeigt werden sollen
    if (config.showIndicators) {
      createSwipeIndicators();
    }

    // Schwellenwerte für Rand-Erkennung
    // Sehr großzügiger Randbereich für einfaches Auslösen
    const EDGE_THRESHOLD = 180; // Extrem hoch für bessere Erkennung am Rand

    // Hilfsfunktion: Navigation zurück - direkter Aufruf ohne try/catch
    const goBack = () => {
      console.log("[SwipeNav] Navigiere zurück via history.back()");
      window.history.back();
    };

    // Hilfsfunktion: Navigation vorwärts - direkter Aufruf ohne try/catch
    const goForward = () => {
      console.log("[SwipeNav] Navigiere vorwärts via history.forward()");
      window.history.forward();
    };

    // Touch-Start Handler - vereinfachte Logik
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return; // Nur Single-Touch verarbeiten
      
      const touch = e.touches[0];
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
      touchStartTime.current = Date.now();
      isSwiping.current = false;
      
      // Prüfen, ob der Touch am Rand begann (für Edge-Only-Modus)
      if (config.edgeOnly) {
        // Sehr großzügiger Bereich für Rand-Erkennung
        if (touch.clientX <= EDGE_THRESHOLD) {
          // Linker Rand - Zurück-Geste möglich
          edgeSwipe.current = true;
          console.log(`[SwipeNav] Linker Rand-Touch erkannt (x=${touch.clientX})`);
        } 
        else if (touch.clientX >= window.innerWidth - EDGE_THRESHOLD) {
          // Rechter Rand - Vorwärts-Geste möglich
          edgeSwipe.current = true;
          console.log(`[SwipeNav] Rechter Rand-Touch erkannt (x=${touch.clientX})`);
        }
        else {
          edgeSwipe.current = false;
        }
      } else {
        // Wenn nicht edge-only, dann immer erlauben
        edgeSwipe.current = true;
      }
    };

    // Touch-Move Handler (für visuelle Indikatoren) - sensitivere Erkennung
    const handleTouchMove = (e: TouchEvent) => {
      // Früher Abbruch wenn Bedingungen nicht erfüllt
      if (
        touchStartX.current === null || 
        !edgeSwipe.current || 
        e.touches.length !== 1
      ) return;

      const touch = e.touches[0];
      const currentX = touch.clientX;
      const distanceX = currentX - touchStartX.current;
      
      // Sofort Feedback anzeigen bei minimaler Bewegung
      if (Math.abs(distanceX) > 3 && !isSwiping.current) {
        isSwiping.current = true;
        
        // Zeige visuelles Feedback entsprechend der Swipe-Richtung
        if (distanceX > 0 && touchStartX.current <= EDGE_THRESHOLD) {
          // Von links nach rechts = zurück (linker Rand)
          setShowLeftIndicator(true);
          setShowRightIndicator(false);
          console.log(`[SwipeNav] Swipe-Indikator Links anzeigen (distX=${distanceX})`);
        } 
        else if (distanceX < 0 && touchStartX.current >= window.innerWidth - EDGE_THRESHOLD) {
          // Von rechts nach links = vorwärts (rechter Rand)
          setShowLeftIndicator(false);
          setShowRightIndicator(true);
          console.log(`[SwipeNav] Swipe-Indikator Rechts anzeigen (distX=${distanceX})`);
        }
      }
    };

    // Touch-End Handler - vereinfachte, zuverlässigere Logik
    const handleTouchEnd = (e: TouchEvent) => {
      if (
        touchStartX.current === null || 
        touchStartY.current === null || 
        touchStartTime.current === null ||
        e.changedTouches.length !== 1
      ) {
        // Ungültiger Touch-End Event oder keine Start-Daten
        return;
      }

      // Verstecke visuelle Indikatoren beim Touch-Ende
      setShowLeftIndicator(false);
      setShowRightIndicator(false);

      // Wenn nicht vom Rand gestartet und edge-only aktiv ist, ignorieren
      if (config.edgeOnly && !edgeSwipe.current) {
        resetTouchState();
        return;
      }

      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;
      const touchEndTime = Date.now();

      // Swipe-Zeit und Distanzen berechnen
      const touchTime = touchEndTime - touchStartTime.current;
      const distanceX = touchEndX - touchStartX.current;
      const distanceY = Math.abs(touchEndY - touchStartY.current);

      console.log(`[SwipeNav] Swipe-Analyse: distanceX=${distanceX}px, distanceY=${distanceY}px, time=${touchTime}ms`);

      // Sehr großzügige Bedingungen für gültigen Swipe
      const isValidSwipe = (
        Math.abs(distanceX) > config.minDistance && 
        touchTime < config.maxTime &&
        // Erlaubt sehr viel vertikale Bewegung, Hauptsache horizontale Bewegung ist da
        distanceY < Math.abs(distanceX) * 2.0
      );

      if (isValidSwipe) {
        // Links nach rechts = zurück (vom linken Rand)
        if (distanceX > 0 && touchStartX.current <= EDGE_THRESHOLD) {
          console.log("[SwipeNav] Links->Rechts Swipe ERKANNT - Navigiere zurück");
          goBack();
        } 
        // Rechts nach links = vorwärts (vom rechten Rand)
        else if (distanceX < 0 && touchStartX.current >= window.innerWidth - EDGE_THRESHOLD) {
          console.log("[SwipeNav] Rechts->Links Swipe ERKANNT - Navigiere vorwärts");
          goForward();
        }
      }

      // Immer den Touch-Status zurücksetzen
      resetTouchState();
    };

    // Hilfsfunktion zum Zurücksetzen des Touch-Status
    const resetTouchState = () => {
      touchStartX.current = null;
      touchStartY.current = null;
      touchStartTime.current = null;
      isSwiping.current = false;
      edgeSwipe.current = false;
    };

    // Keyboard-Handler für Desktop-Nutzer
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+Pfeil links = zurück
      if (e.altKey && e.key === 'ArrowLeft') {
        goBack();
      }
      // Alt+Pfeil rechts = vorwärts
      else if (e.altKey && e.key === 'ArrowRight') {
        goForward();
      }
    };

    // Event-Listener hinzufügen mit { passive: true } für bessere Performance
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('keydown', handleKeyDown);

    // Logging für Debug-Zwecke
    console.log(`[SwipeNav] Swipe-Navigation initialisiert (Edge-Threshold: ${EDGE_THRESHOLD}px)`);

    // Event-Listener entfernen bei Komponenten-Unmount
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Entferne Indikator-Elemente
      if (config.showIndicators) {
        removeSwipeIndicators();
      }
    };
  }, [config.minDistance, config.maxTime, config.showIndicators, config.edgeOnly, router]);

  // Aktualisiere die Sichtbarkeit der Indikatoren
  useEffect(() => {
    const leftIndicator = document.querySelector('.swipe-indicator-left');
    const rightIndicator = document.querySelector('.swipe-indicator-right');
    
    if (leftIndicator) {
      if (showLeftIndicator) {
        leftIndicator.classList.add('swipe-indicator-active');
      } else {
        leftIndicator.classList.remove('swipe-indicator-active');
      }
    }
    
    if (rightIndicator) {
      if (showRightIndicator) {
        rightIndicator.classList.add('swipe-indicator-active');
      } else {
        rightIndicator.classList.remove('swipe-indicator-active');
      }
    }
  }, [showLeftIndicator, showRightIndicator]);

  // Hilfsfunktion zum Erstellen der Swipe-Indikatoren
  function createSwipeIndicators() {
    // Nur erstellen, wenn sie noch nicht existieren
    if (!document.querySelector('.swipe-indicator')) {
      // Linkspfeil-Indikator
      const leftIndicator = document.createElement('div');
      leftIndicator.className = 'swipe-indicator swipe-indicator-left';
      const leftArrow = document.createElement('div');
      leftArrow.className = 'swipe-arrow swipe-arrow-left';
      leftIndicator.appendChild(leftArrow);
      document.body.appendChild(leftIndicator);
      
      // Rechtspfeil-Indikator
      const rightIndicator = document.createElement('div');
      rightIndicator.className = 'swipe-indicator swipe-indicator-right';
      const rightArrow = document.createElement('div');
      rightArrow.className = 'swipe-arrow swipe-arrow-right';
      rightIndicator.appendChild(rightArrow);
      document.body.appendChild(rightIndicator);
    }
  }

  // Hilfsfunktion zum Entfernen der Swipe-Indikatoren
  function removeSwipeIndicators() {
    const indicators = document.querySelectorAll('.swipe-indicator');
    indicators.forEach(indicator => {
      if (indicator.parentNode) {
        indicator.parentNode.removeChild(indicator);
      }
    });
  }

  // Kein Rückgabewert notwendig, da es ein Hook ist
  return null;
} 