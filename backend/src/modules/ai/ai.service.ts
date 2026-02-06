import { PoliciesRepository } from '../policies/policies.repository.js';

export class AIService {
    private repo = new PoliciesRepository();

    async generateInsights(filters: any) {
        const summary = await this.repo.getSummary();
        const { items } = await this.repo.findMany({ limit: 100, offset: 0, ...filters });

        const insights: string[] = [];
        let riskFlags = 0;

        if (summary.total_policies > 0) {
            insights.push(`Se analizó una cartera de ${summary.total_policies} pólizas activas.`);
        }

        const lowValuePolicies = items.filter((p: any) => {
            const minLimit = p.policy_type === 'Property' ? 5000 : 10000;
            return p.insured_value_usd < (minLimit * 1.2);
        });

        if (lowValuePolicies.length > 0) {
            insights.push(`⚠️ Riesgo Detectado: ${lowValuePolicies.length} pólizas tienen un valor asegurado peligrosamente cerca del mínimo legal.`);
            riskFlags++;
        }

        const autoCount = items.filter((p: any) => p.policy_type === 'Auto').length;
        const propCount = items.filter((p: any) => p.policy_type === 'Property').length;
        
        if (propCount > 0 && autoCount > propCount * 2) {
            insights.push(`Tendencia: La cartera está muy concentrada en Automóviles (${autoCount} vs ${propCount}). Se recomienda diversificar hacia Propiedad.`);
        }

        insights.push("💡 Acción sugerida: Configurar alertas automáticas para renovaciones con +10% de prima.");

        return {
            insights,
            highlights: {
                total_policies: summary.total_policies,
                risk_flags: riskFlags
            }
        };
    }
}