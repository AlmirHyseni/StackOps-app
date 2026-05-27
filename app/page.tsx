"use client";

import { useState, useEffect } from "react";

interface Resource {
  _id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
}

export default function Home() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Compute (EC2)");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // 1. Lexo resurset nga MongoDB (IaC State)
  const fetchResources = async () => {
    try {
      const res = await fetch("/api/resources");
      const data = await res.json();
      if (data.success) {
        setResources(data.data);
      }
    } catch (error) {
      console.error("Gabim gjatë marrjes së të dhënave:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchResources();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Simulimi i "terraform apply" (Krijimi)
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ju lutem jepni një emër resursi!");

    setLoading(true);
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });
      const data = await res.json();

      if (data.success) {
        setName("");
        fetchResources(); // Rifresko listën
      }
    } catch (error) {
      console.error("Gabim gjatë krijimit:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Simulimi i "terraform destroy" (Fshirja)
  const handleDestroy = async (id: string) => {
    if (!confirm("A jeni i sigurt që dëshironi ta shkatërroni këtë resurs? (IaC Destroy)")) return;

    try {
      const res = await fetch(`/api/resources?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchResources(); // Rifresko listën
      }
    } catch (error) {
      console.error("Gabim gjatë fshirjes:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            StackOps Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Infrastructure as Code Starter Stack Simulation (Next.js & MongoDB)
          </p>
        </div>
        <div className="mt-4 md:mt-0 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-xs text-slate-400">
          Statusi i Cloud-it: <span className="text-emerald-400 font-semibold">● Connected</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Paneli i Provizionimit (Forma) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-400">⚡</span> IaC Configuration
          </h2>
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Emri i Resursit
              </label>
              <input
                type="text"
                placeholder="p.sh. web-server-production"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Lloji i Infrastrukturës (Type)
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="Compute (EC2)">Compute (EC2 Instance)</option>
                <option value="Storage (S3)">Storage (S3 Bucket)</option>
                <option value="Database (RDS)">Database (RDS MySQL)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-sm py-2.5 rounded-lg transition-all shadow-lg shadow-cyan-950 disabled:opacity-50"
            >
              {loading ? "Planimetria po dërgohet..." : "🚀 Run IaC Apply"}
            </button>
          </form>
        </div>

        {/* Paneli i Shfaqjes së Resurseve (Dashboard-i) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span>🖥️</span> Live Infrastructure Stack
            </h2>
            <span className="bg-slate-900 border border-slate-800 text-xs text-slate-400 px-2.5 py-1 rounded-full">
              {resources.length} Resurse Aktive
            </span>
          </div>

          {fetchLoading ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              Duke ngarkuar gjendjen e infrastrukturës...
            </div>
          ) : resources.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-xl p-12 text-center text-slate-500 text-sm">
              Nuk ka asnjë resurs të ngritur. Përdor panelin anësor për të bërë &quot;Apply&quot; infrastrukturën tënde të parë.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resource) => (
                <div
                  key={resource._id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        resource.type.includes("Compute") ? "bg-amber-950 text-amber-400 border border-amber-900" :
                        resource.type.includes("Storage") ? "bg-teal-950 text-teal-400 border border-teal-900" :
                        "bg-purple-950 text-purple-400 border border-purple-900"
                      }`}>
                        {resource.type}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(resource.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-white tracking-tight truncate">
                      {resource.name}
                    </h3>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active
                    </div>
                    <button
                      onClick={() => handleDestroy(resource._id)}
                      className="text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-950/60 border border-rose-900/50 px-3 py-1.5 rounded-md transition-colors"
                    >
                      💥 Destroy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
