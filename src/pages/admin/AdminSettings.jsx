import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, ToggleLeft, ToggleRight, Clock, DollarSign, Lock, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

export default function AdminSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { settings, updateSettings, toggleRestaurant } = useApp();
  const { logout } = useAuth();

  const [form, setForm] = useState({ ...settings });
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm({ ...settings }); }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    updateSettings(form);
    toast.success('Settings saved!', { style: { background: '#16211a', color: '#e8f0ec' } });
    setSaving(false);
  };

  const handleToggleRestaurant = () => {
    const updated = toggleRestaurant();
    toast.success(updated.restaurantOpen ? '🟢 Restaurant is now OPEN' : '🔴 Restaurant is now CLOSED', {
      style: { background: '#16211a', color: '#e8f0ec' },
    });
  };

  const handleHoursChange = (day, key, val) => {
    setForm(f => ({
      ...f,
      operatingHours: {
        ...f.operatingHours,
        [day]: { ...f.operatingHours[day], [key]: val },
      },
    }));
  };

  const handlePwdSave = (e) => {
    e.preventDefault();
    const validCurrentPasswords = ['Starvingowner', 'Starvingadmin', 'Starvingstaff'];
    if (!validCurrentPasswords.includes(pwdForm.current)) {
      toast.error('Current password is incorrect');
      return;
    }
    if (pwdForm.newPwd.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password updated successfully! Please log in again.');
    setPwdForm({ current: '', newPwd: '', confirm: '' });
    setTimeout(() => logout(), 1500);
  };

  const SectionTitle = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 rounded-lg bg-brand-gold/15 flex items-center justify-center">
        <Icon size={14} className="text-brand-gold" />
      </div>
      <h2 className="font-semibold text-white text-sm">{title}</h2>
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <AdminHeader title="Settings" onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-6">
          <form onSubmit={handleSave} className="max-w-2xl space-y-6">

            {/* Restaurant Status */}
            <div className="glass-card p-5">
              <SectionTitle icon={ToggleRight} title="Restaurant Status" />
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/8 bg-white/3">
                <div>
                  <p className="font-semibold text-white text-sm">
                    {settings.restaurantOpen ? '🟢 Currently OPEN' : '🔴 Currently CLOSED'}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {settings.restaurantOpen ? 'Customers can place orders.' : 'Orders are paused. Customers see a closed message.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleRestaurant}
                  className={`w-14 h-7 rounded-full transition-all relative ${settings.restaurantOpen ? 'bg-green-500' : 'bg-red-500/40'}`}
                >
                  <motion.div
                    animate={{ x: settings.restaurantOpen ? 28 : 2 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-1"
                  />
                </button>
              </div>
            </div>

            {/* Delivery Settings */}
            <div className="glass-card p-5">
              <SectionTitle icon={DollarSign} title="Delivery & Pricing" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Delivery Fee (PKR)</label>
                  <input type="number" className="input-field" value={form.deliveryFee}
                    onChange={e => setForm(f => ({ ...f, deliveryFee: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="input-label">Minimum Order (PKR)</label>
                  <input type="number" className="input-field" value={form.minOrderAmount}
                    onChange={e => setForm(f => ({ ...f, minOrderAmount: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="input-label">Free Delivery Above (PKR)</label>
                  <input type="number" className="input-field" value={form.freeDeliveryAbove}
                    onChange={e => setForm(f => ({ ...f, freeDeliveryAbove: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="input-label">Est. Delivery Time (min)</label>
                  <input type="number" className="input-field" value={form.estimatedDeliveryTime}
                    onChange={e => setForm(f => ({ ...f, estimatedDeliveryTime: Number(e.target.value) }))} />
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="glass-card p-5">
              <SectionTitle icon={DollarSign} title="Promo Code" />
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Enable promo code</span>
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, promo: { ...f.promo, enabled: !f.promo.enabled } }))}
                    className={`w-10 h-5 rounded-full transition-all relative ${form.promo?.enabled ? 'bg-brand-gold' : 'bg-white/15'}`}
                  >
                    <motion.div animate={{ x: form.promo?.enabled ? 20 : 2 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5" />
                  </button>
                </label>
                {form.promo?.enabled && (
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="input-label">Code</label>
                      <input type="text" className="input-field" placeholder="KING10"
                        value={form.promo.code}
                        onChange={e => setForm(f => ({ ...f, promo: { ...f.promo, code: e.target.value.toUpperCase() } }))} />
                    </div>
                    <div>
                      <label className="input-label">Discount</label>
                      <input type="number" className="input-field" value={form.promo.discount}
                        onChange={e => setForm(f => ({ ...f, promo: { ...f.promo, discount: Number(e.target.value) } }))} />
                    </div>
                    <div>
                      <label className="input-label">Type</label>
                      <select className="input-field" value={form.promo.type}
                        onChange={e => setForm(f => ({ ...f, promo: { ...f.promo, type: e.target.value } }))}>
                        <option value="percent" style={{ background: '#16211a' }}>Percent %</option>
                        <option value="fixed"   style={{ background: '#16211a' }}>Fixed PKR</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="glass-card p-5">
              <SectionTitle icon={Phone} title="Contact Information" />
              <div className="space-y-3">
                {[
                  { key: 'phone',    label: 'Phone Number', placeholder: '+92 300 0000000' },
                  { key: 'whatsapp', label: 'WhatsApp',     placeholder: '+92 300 0000000' },
                  { key: 'email',    label: 'Email',        placeholder: 'info@starving.com' },
                  { key: 'address',  label: 'Address',      placeholder: 'Street, City' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="input-label">{label}</label>
                    <input type="text" className="input-field" placeholder={placeholder}
                      value={form.contactInfo?.[key] || ''}
                      onChange={e => setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, [key]: e.target.value } }))} />
                  </div>
                ))}
                <div>
                  <label className="input-label">Google Maps Embed URL</label>
                  <input type="text" className="input-field" placeholder="https://maps.google.com/maps?..."
                    value={form.contactInfo?.mapEmbedUrl || ''}
                    onChange={e => setForm(f => ({ ...f, contactInfo: { ...f.contactInfo, mapEmbedUrl: e.target.value } }))} />
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="glass-card p-5">
              <SectionTitle icon={Clock} title="Operating Hours" />
              <div className="space-y-2">
                {DAYS.map(day => {
                  const h = form.operatingHours?.[day] || {};
                  return (
                    <div key={day} className="flex items-center gap-3">
                      <span className="text-white/60 text-xs capitalize w-20 flex-shrink-0">{day}</span>
                      <input type="time" className="input-field py-1.5 text-xs flex-1" value={h.open || '12:00'}
                        onChange={e => handleHoursChange(day, 'open', e.target.value)} disabled={h.closed} />
                      <span className="text-white/30 text-xs">–</span>
                      <input type="time" className="input-field py-1.5 text-xs flex-1" value={h.close || '01:00'}
                        onChange={e => handleHoursChange(day, 'close', e.target.value)} disabled={h.closed} />
                      <label className="flex items-center gap-1.5 cursor-pointer flex-shrink-0">
                        <input type="checkbox" className="sr-only" checked={!!h.closed}
                          onChange={e => handleHoursChange(day, 'closed', e.target.checked)} />
                        <div className={`w-8 h-4 rounded-full transition-all relative ${h.closed ? 'bg-red-500/50' : 'bg-white/10'}`}>
                          <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${h.closed ? 'left-4' : 'left-0.5'}`} style={{ left: h.closed ? '16px' : '2px' }} />
                        </div>
                        <span className="text-xs text-white/35">Off</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Online Payment Methods (JazzCash & EasyPaisa) */}
            <div className="glass-card p-5">
              <SectionTitle icon={DollarSign} title="Payment Methods & Accounts" />
              <div className="space-y-5">
                {/* Cash on Delivery */}
                <div className="p-3.5 rounded-xl border border-white/10 bg-white/3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white text-sm">💵 Cash on Delivery (COD)</p>
                    <p className="text-white/40 text-xs mt-0.5">Allow customers to pay cash when food arrives</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({
                      ...f,
                      paymentMethods: {
                        ...f.paymentMethods,
                        cod: { ...f.paymentMethods?.cod, enabled: !f.paymentMethods?.cod?.enabled },
                      },
                    }))}
                    className={`w-12 h-6 rounded-full transition-all relative ${form.paymentMethods?.cod?.enabled !== false ? 'bg-brand-gold' : 'bg-white/15'}`}
                  >
                    <motion.div
                      animate={{ x: form.paymentMethods?.cod?.enabled !== false ? 26 : 2 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="w-4 h-4 bg-white rounded-full absolute top-1"
                    />
                  </button>
                </div>

                {/* JazzCash Configuration */}
                <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-orange-400 text-sm">🟠 JazzCash Online Payment</p>
                      <p className="text-white/40 text-xs">Customer transfers via JazzCash and enters Transaction ID</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({
                        ...f,
                        paymentMethods: {
                          ...f.paymentMethods,
                          jazzcash: { ...f.paymentMethods?.jazzcash, enabled: !f.paymentMethods?.jazzcash?.enabled },
                        },
                      }))}
                      className={`w-12 h-6 rounded-full transition-all relative ${form.paymentMethods?.jazzcash?.enabled !== false ? 'bg-orange-500' : 'bg-white/15'}`}
                    >
                      <motion.div
                        animate={{ x: form.paymentMethods?.jazzcash?.enabled !== false ? 26 : 2 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="w-4 h-4 bg-white rounded-full absolute top-1"
                      />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="input-label">JazzCash Mobile / Account #</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="+92 339 666733"
                        value={form.paymentMethods?.jazzcash?.accountNumber ?? (form.contactInfo?.whatsapp || '+92 339 666733')}
                        onChange={e => setForm(f => ({
                          ...f,
                          paymentMethods: {
                            ...f.paymentMethods,
                            jazzcash: { ...f.paymentMethods?.jazzcash, accountNumber: e.target.value },
                          },
                        }))}
                      />
                    </div>
                    <div>
                      <label className="input-label">JazzCash Account Title</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="STARVING / Fast Food"
                        value={form.paymentMethods?.jazzcash?.accountTitle ?? 'STARVING / Fast Food'}
                        onChange={e => setForm(f => ({
                          ...f,
                          paymentMethods: {
                            ...f.paymentMethods,
                            jazzcash: { ...f.paymentMethods?.jazzcash, accountTitle: e.target.value },
                          },
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* EasyPaisa Configuration */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-400 text-sm">🟢 EasyPaisa Online Payment</p>
                      <p className="text-white/40 text-xs">Customer transfers via EasyPaisa and enters Transaction ID</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({
                        ...f,
                        paymentMethods: {
                          ...f.paymentMethods,
                          easypaisa: { ...f.paymentMethods?.easypaisa, enabled: !f.paymentMethods?.easypaisa?.enabled },
                        },
                      }))}
                      className={`w-12 h-6 rounded-full transition-all relative ${form.paymentMethods?.easypaisa?.enabled !== false ? 'bg-emerald-500' : 'bg-white/15'}`}
                    >
                      <motion.div
                        animate={{ x: form.paymentMethods?.easypaisa?.enabled !== false ? 26 : 2 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="w-4 h-4 bg-white rounded-full absolute top-1"
                      />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="input-label">EasyPaisa Mobile / Account #</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="+92 339 666733"
                        value={form.paymentMethods?.easypaisa?.accountNumber ?? (form.contactInfo?.whatsapp || '+92 339 666733')}
                        onChange={e => setForm(f => ({
                          ...f,
                          paymentMethods: {
                            ...f.paymentMethods,
                            easypaisa: { ...f.paymentMethods?.easypaisa, accountNumber: e.target.value },
                          },
                        }))}
                      />
                    </div>
                    <div>
                      <label className="input-label">EasyPaisa Account Title</label>
                      <input
                        type="text"
                        className="input-field"
                        placeholder="STARVING / Fast Food"
                        value={form.paymentMethods?.easypaisa?.accountTitle ?? 'STARVING / Fast Food'}
                        onChange={e => setForm(f => ({
                          ...f,
                          paymentMethods: {
                            ...f.paymentMethods,
                            easypaisa: { ...f.paymentMethods?.easypaisa, accountTitle: e.target.value },
                          },
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save button */}
            <button type="submit" disabled={saving} className="btn-gold w-full justify-center disabled:opacity-60" id="save-settings">
              {saving ? 'Saving...' : <><Save size={15} /> Save All Settings</>}
            </button>
          </form>

          {/* Change Password (separate section) */}
          <div className="max-w-2xl mt-6">
            <form onSubmit={handlePwdSave} className="glass-card p-5 space-y-4">
              <SectionTitle icon={Lock} title="Change Password" />
              {[
                { key: 'current', label: 'Current Password',  placeholder: 'Enter current password' },
                { key: 'newPwd',  label: 'New Password',      placeholder: 'At least 6 characters' },
                { key: 'confirm', label: 'Confirm Password',  placeholder: 'Repeat new password' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="input-label">{label}</label>
                  <div className="relative">
                    <input type={showPwd ? 'text' : 'password'} className="input-field pr-10" placeholder={placeholder}
                      value={pwdForm[key]} onChange={e => setPwdForm(f => ({ ...f, [key]: e.target.value }))} />
                    <button type="button" onClick={() => setShowPwd(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}
              <button type="submit" className="btn-outline-gold text-xs py-2.5 px-5">
                <Lock size={13} /> Update Password
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
