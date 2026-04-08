import React, { useState, useMemo } from 'react';
import './App.css';
import { Layout, Globe, ShoppingCart, Server, Globe2, CreditCard, ChevronRight } from 'lucide-react';
import CardSelector from './components/CardSelector';
import ToggleSwitch from './components/ToggleSwitch';

function App() {
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState('landing');
  const [pageCount, setPageCount] = useState(1);
  const [addons, setAddons] = useState({
    hosting: true,
    multilang: false,
    payments: false,
  });

  const projectTypes = [
    { id: 'landing', title: 'Landing Page', description: 'One-page site focusing on conversion', icon: Layout, basePrice: 500 },
    { id: 'corporate', title: 'Web Corporativa', description: 'Multi-page site for business identity', icon: Globe, basePrice: 800 },
    { id: 'ecommerce', title: 'E-commerce', description: 'Online store with product catalog', icon: ShoppingCart, basePrice: 1500 },
  ];

  const addonFeatures = [
    { id: 'hosting', label: 'Tiene Dominio/Hosting', description: 'Si no lo tienes, lo configuramos por ti (+150€)', icon: Server },
    { id: 'multilang', label: 'Necesita Multi-idioma', description: 'Añade un 30% adicional al coste total', icon: Globe2 },
    { id: 'payments', label: 'Pasarela de Pago', description: 'Integración con Stripe o PayPal (+200€)', icon: CreditCard },
  ];

  const handleAddonChange = (id, value) => {
    setAddons(prev => ({ ...prev, [id]: value }));
  };

  const selectedType = projectTypes.find(t => t.id === projectType);

  // Calculate pricing
  const pricing = useMemo(() => {
    let sub = selectedType?.basePrice || 0;
    
    let pagesCost = 0;
    if (pageCount >= 6 && pageCount <= 10) {
      pagesCost = 200;
    } else if (pageCount > 10) {
      pagesCost = 200 + (pageCount - 10) * 50;
    }
    
    let add = 0;
    if (!addons.hosting) add += 150;
    if (addons.payments) add += 200;

    let preMultiLangTotal = sub + pagesCost + add;
    
    let multiLangCost = 0;
    if (addons.multilang) {
      multiLangCost = preMultiLangTotal * 0.30;
    }
    
    const total = preMultiLangTotal + multiLangCost;

    return { 
      basePrice: sub, 
      pagesCost, 
      hostingCost: (!addons.hosting ? 150 : 0), 
      paymentsCost: (addons.payments ? 200 : 0), 
      multiLangCost, 
      total: Math.round(total) 
    };
  }, [selectedType, pageCount, addons]);

  return (
    <div className="app-container">
      {/* LEFT PANEL */}
      <main className="form-panel">
        <h1 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Calculadora de Presupuestos</h1>

        {/* STEP 1 */}
        <section className="step-section">
          <div className="step-header">
            <h2 className="step-title">
              <span className="step-number">1</span>
              Información Básica
            </h2>
            <p>Datos del cliente y tipo principal de proyecto.</p>
          </div>

          <div className="input-group">
            <label className="label" htmlFor="clientName">Nombre del Cliente</label>
            <input 
              id="clientName"
              type="text" 
              className="input-field" 
              placeholder="Ej. Acme Corp..." 
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="label">Tipo de Proyecto</label>
            <div className="cards-grid">
              {projectTypes.map((type) => (
                <CardSelector 
                  key={type.id}
                  id={type.id}
                  title={type.title}
                  description={type.description}
                  icon={type.icon}
                  selected={projectType === type.id}
                  onClick={setProjectType}
                />
              ))}
            </div>
          </div>
        </section>

        <div className="divider"></div>

        {/* STEP 2 */}
        <section className="step-section">
          <div className="step-header">
            <h2 className="step-title">
              <span className="step-number">2</span>
              Estructura y Opciones
            </h2>
            <p>Define la magnitud del proyecto y funcionalidades extra.</p>
          </div>

          <div className="input-group" style={{ maxWidth: '300px' }}>
            <label className="label" htmlFor="pageCount">Cantidad de Páginas estimadas</label>
            <input 
              id="pageCount"
              type="number" 
              min="1"
              className="input-field" 
              value={pageCount}
              onChange={(e) => setPageCount(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="input-group">
            <label className="label">Opciones Extra</label>
            <div className="toggle-group">
              {addonFeatures.map((feature) => (
                <ToggleSwitch 
                  key={feature.id}
                  id={feature.id}
                  label={feature.label}
                  description={feature.description}
                  icon={feature.icon}
                  checked={addons[feature.id]}
                  onChange={handleAddonChange}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* RIGHT PANEL */}
      <aside className="summary-panel">
        <div className="summary-card">
          <div className="summary-header">
            <h3>Resumen del Proyecto</h3>
            <p style={{ fontSize: '0.875rem' }}>{clientName ? `Cliente: ${clientName}` : 'Cliente no especificado'}</p>
          </div>
          
          <div className="summary-details">
            <div className="summary-item">
              <span>{selectedType?.title} (Base)</span>
              <span>{pricing.basePrice}€</span>
            </div>
            {pricing.pagesCost > 0 && (
              <div className="summary-item">
                <span>Coste por páginas extra</span>
                <span>{pricing.pagesCost}€</span>
              </div>
            )}
            
            {(pricing.hostingCost > 0 || pricing.paymentsCost > 0 || pricing.multiLangCost > 0) && (
              <div style={{ margin: '1rem 0', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Opciones Extra</p>
                {pricing.hostingCost > 0 && (
                  <div className="summary-item">
                    <span>Gestión Dominio / Hosting</span>
                    <span>150€</span>
                  </div>
                )}
                {pricing.paymentsCost > 0 && (
                  <div className="summary-item">
                    <span>Pasarela de Pago</span>
                    <span>200€</span>
                  </div>
                )}
                {pricing.multiLangCost > 0 && (
                  <div className="summary-item" style={{ color: 'var(--accent-color)', fontWeight: 500 }}>
                    <span>Multi-idioma (+30%)</span>
                    <span>{Math.round(pricing.multiLangCost)}€</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="summary-total">
              <span>Total Estimado</span>
              <span>{pricing.total}€</span>
            </div>
          </div>
        </div>
        
        <button className="btn-primary" onClick={() => alert('¡Presupuesto Generado!\n\nCliente: ' + clientName + '\nTotal: ' + pricing.total + '€')}>
          Generar Presupuesto <ChevronRight size={20} />
        </button>
      </aside>
    </div>
  );
}

export default App;
