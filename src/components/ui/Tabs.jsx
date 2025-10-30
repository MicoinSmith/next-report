import { createContext, useContext, useEffect, useRef, useState } from "react";

const TabsContext = createContext(null);

function Root({ defaultValue, value: controlledValue, onValueChange, indicatorBasis = "label", children }) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const active = isControlled ? controlledValue : uncontrolled;

  const setActive = (v) => {
    if (!isControlled) setUncontrolled(v);
    if (onValueChange) onValueChange(v);
  };

  // indicator state and refs
  const tabRefs = useRef({});
  const labelRefs = useRef({});
  const containerRef = useRef(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const container = containerRef.current;
    let basisEl = indicatorBasis === "trigger" ? tabRefs.current[active] : labelRefs.current[active];
    // Fallback when label span is not provided
    if (!basisEl) basisEl = tabRefs.current[active] || labelRefs.current[active];
    if (container && basisEl) {
      const containerRect = container.getBoundingClientRect();
      const basisRect = basisEl.getBoundingClientRect();
      const left = Math.max(0, basisRect.left - containerRect.left);
      const width = Math.max(0, basisRect.width);
      setIndicator({ left, width });
    }
  }, [active, children, indicatorBasis]);

  useEffect(() => {
    const onResize = () => {
      const container = containerRef.current;
      let basisEl = indicatorBasis === "trigger" ? tabRefs.current[active] : labelRefs.current[active];
      if (!basisEl) basisEl = tabRefs.current[active] || labelRefs.current[active];
      if (container && basisEl) {
        const containerRect = container.getBoundingClientRect();
        const basisRect = basisEl.getBoundingClientRect();
        const left = Math.max(0, basisRect.left - containerRect.left);
        const width = Math.max(0, basisRect.width);
        setIndicator({ left, width });
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, indicatorBasis]);

  const ctx = {
    active,
    setActive,
    refs: { tabRefs, labelRefs, containerRef },
    indicator,
    indicatorBasis,
  };

  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
}

function List({ children }) {
  const { refs, indicator } = useContext(TabsContext);
  return (
    <div ref={refs.containerRef} className="relative flex gap-2 border-b dark:border-neutral-800">
      {children}
      <span
        className="absolute bottom-0 h-[2px] bg-black dark:bg-white transition-all duration-300"
        style={{ left: indicator.left, width: indicator.width }}
      />
    </div>
  );
}

function Trigger({ value, className = "", children }) {
  const { active, setActive, refs } = useContext(TabsContext);
  return (
    <button
      type="button"
      onClick={() => setActive(value)}
      ref={(el) => (refs.tabRefs.current[value] = el)}
      className={`px-3 py-2 text-sm cursor-pointer inline-flex items-center gap-1 whitespace-nowrap ${
        active === value ? "text-black dark:text-white font-medium" : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
      } ${className}`}
    >
        {children}
    </button>
  );
}

function Pane({ value, children, keepMounted = false }) {
  const { active } = useContext(TabsContext);
  if (keepMounted) {
    return <div style={{ display: active === value ? "block" : "none" }}>{children}</div>;
  }
  return active === value ? <div>{children}</div> : null;
}

const Tabs = Object.assign(Root, { List, Trigger, Pane });

export default Tabs;
