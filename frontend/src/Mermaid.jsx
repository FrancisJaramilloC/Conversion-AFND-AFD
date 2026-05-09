import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

const Mermaid = ({ chart }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && chart) {
      const renderChart = async () => {
        try {
          const result = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart);
          if (ref.current) {
            ref.current.innerHTML = result.svg;
          }
        } catch (error) {
          console.error('Failed to render mermaid chart:', error);
        }
      };
      renderChart();
    }
  }, [chart]);

  return <div className="mermaid-chart" ref={ref} />;
};

export default Mermaid;
