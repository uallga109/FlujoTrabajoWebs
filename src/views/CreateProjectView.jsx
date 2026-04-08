import React, { useState, useMemo } from 'react';
import { Layout, Globe, ShoppingCart, Server, Globe2, CreditCard, ChevronRight, ArrowLeft } from 'lucide-react';
import CardSelector from '../components/CardSelector';
import ToggleSwitch from '../components/ToggleSwitch';
import { jsPDF } from "jspdf";
import { supabase } from '../lib/supabase';

const CreateProjectView = ({ setCurrentView, setShowSuccess }) => {
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

  const handleGenerateBudget = async () => {
    const payload = {
      clientName: clientName || "Cliente sin especificar",
      projectType: selectedType?.title,
      pageCount: pageCount,
      hasDomain: addons.hosting,
      totalPrice: pricing.total
    };
    
    try {
      const response = await fetch('https://hook.eu1.make.com/jmcrdykziikwvml05vfon4x1kcrejzba', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        console.error("Error en webhook:", response.status);
      }
    } catch (error) {
      console.error("Error enviando webhook:", error);
    }

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Presupuesto de Proyecto Web", 20, 20);
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${clientName || "No especificado"}`, 20, 35);
    doc.text(`Tipo de Proyecto: ${selectedType?.title}`, 20, 45);
    doc.text(`Número de páginas: ${pageCount}`, 20, 55);
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Desglose:", 20, 75);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    let yPos = 85;
    
    doc.text(`${selectedType?.title} (Base):`, 20, yPos);
    doc.text(`${pricing.basePrice} EUR`, 150, yPos);
    yPos += 10;
    
    if (pricing.pagesCost > 0) {
      doc.text("Coste por páginas extra:", 20, yPos);
      doc.text(`${pricing.pagesCost} EUR`, 150, yPos);
      yPos += 10;
    }
    if (pricing.hostingCost > 0) {
      doc.text("Gestión Dominio/Hosting:", 20, yPos);
      doc.text(`150 EUR`, 150, yPos);
      yPos += 10;
    }
    if (pricing.paymentsCost > 0) {
      doc.text("Pasarela de Pago:", 20, yPos);
      doc.text(`200 EUR`, 150, yPos);
      yPos += 10;
    }
    if (pricing.multiLangCost > 0) {
      doc.text("Multi-idioma (+30%):", 20, yPos);
      doc.text(`${Math.round(pricing.multiLangCost)} EUR`, 150, yPos);
      yPos += 10;
    }
    
    doc.setLineWidth(0.5);
    doc.line(20, yPos + 5, 190, yPos + 5);
    yPos += 15;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Total Estimado:", 20, yPos);
    doc.text(`${pricing.total} EUR`, 150, yPos);
    
    const fileName = clientName ? `Presupuesto_${clientName.replace(/\s+/g, '_')}.pdf` : "Presupuesto.pdf";
    doc.save(fileName);

    const creationDate = new Date();
    const deliveryDate = new Date(creationDate.getTime() + 15 * 24 * 60 * 60 * 1000);
    
    const newProject = {
      nombre_cliente: clientName || "Cliente sin especificar",
      tipo_proyecto: selectedType?.title,
      precio_total: pricing.total,
      fecha_estimada: deliveryDate.toISOString().split('T')[0],
      estado: 'activo'
    };
    
    const { error } = await supabase
      .from('proyectos')
      .insert([newProject]);

    if (error) {
      console.error("Error guardando en Supabase:", error);
      alert("Hubo un error guardando el proyecto en Supabase.");
      return;
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
    setCurrentView('dashboard');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full">
      <main className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm h-fit">
        <button 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition-colors"
          onClick={() => setCurrentView('dashboard')}
        >
          <ArrowLeft size={16} /> Volver al Dashboard
        </button>
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Calculadora de Presupuestos</h1>

        {/* STEP 1 */}
        <section className="mb-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 mb-1">
              <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">1</span>
              Información Básica
            </h2>
            <p className="text-gray-500 text-sm ml-10">Datos del cliente y tipo principal de proyecto.</p>
          </div>

          <div className="ml-10 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="clientName">Nombre del Cliente</label>
              <input 
                id="clientName"
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900" 
                placeholder="Ej. Acme Corp..." 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Proyecto</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        </section>

        <div className="h-px bg-gray-200 w-full my-8"></div>

        {/* STEP 2 */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold flex items-center gap-3 text-gray-900 mb-1">
              <span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm">2</span>
              Estructura y Opciones
            </h2>
            <p className="text-gray-500 text-sm ml-10">Define la magnitud del proyecto y funcionalidades extra.</p>
          </div>

          <div className="ml-10 space-y-8">
            <div className="max-w-[300px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="pageCount">Cantidad de Páginas estimadas</label>
              <input 
                id="pageCount"
                type="number" 
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium text-gray-900" 
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Opciones Extra</label>
              <div className="space-y-3">
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
          </div>
        </section>
      </main>

      <aside className="w-full lg:w-[400px] flex-shrink-0 flex flex-col">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-8">
          <div className="border-b border-dashed border-gray-200 pb-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900">Resumen del Proyecto</h3>
            <p className="text-sm text-gray-500 mt-1">{clientName ? `Cliente: ${clientName}` : 'Cliente no especificado'}</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">{selectedType?.title} (Base)</span>
              <span className="font-semibold text-gray-900">{pricing.basePrice}€</span>
            </div>
            {pricing.pagesCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Coste por páginas extra</span>
                <span className="font-semibold text-gray-900">{pricing.pagesCost}€</span>
              </div>
            )}
            
            {(pricing.hostingCost > 0 || pricing.paymentsCost > 0 || pricing.multiLangCost > 0) && (
              <div className="pt-4 mt-2 border-t border-gray-100">
                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">Opciones Extra</p>
                {pricing.hostingCost > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Gestión Dominio / Hosting</span>
                    <span className="font-semibold text-gray-900">150€</span>
                  </div>
                )}
                {pricing.paymentsCost > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Pasarela de Pago</span>
                    <span className="font-semibold text-gray-900">200€</span>
                  </div>
                )}
                {pricing.multiLangCost > 0 && (
                  <div className="flex justify-between text-sm text-blue-600 font-medium">
                    <span>Multi-idioma (+30%)</span>
                    <span>{Math.round(pricing.multiLangCost)}€</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-dashed border-gray-200 space-y-1">
              <span className="font-bold text-gray-900 text-lg">Total Estimado</span>
              <span className="font-extrabold text-blue-600 text-2xl">{pricing.total}€</span>
            </div>
          </div>
          
          <button 
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-[0.98]" 
            onClick={handleGenerateBudget}
          >
            Generar Presupuesto <ChevronRight size={20} />
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CreateProjectView;
