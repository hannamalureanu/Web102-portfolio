import React from 'react';
import { useLayout } from '../contexts/LayoutContext';

const LayoutSwitcher = () => {
  const { layout, setLayout } = useLayout();

  return (
    <div className="layout-switcher">
      <button className={layout === 'professional' ? 'active' : ''} onClick={() => setLayout('professional')}>Profesional</button>
      <button className={layout === 'whimsical' ? 'active' : ''} onClick={() => setLayout('whimsical')}>Whimsical</button>
      <button className={layout === 'retro' ? 'active' : ''} onClick={() => setLayout('retro')}>Retro</button>
    </div>
  );
};

export default LayoutSwitcher;