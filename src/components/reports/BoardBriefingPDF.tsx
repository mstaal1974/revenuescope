import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#FFFFFF', fontFamily: 'Helvetica' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: '#0F172A', paddingBottom: 10 },
  brand: { fontSize: 10, color: '#64748B', textTransform: 'uppercase', letterSpacing: 1 },
  confidential: { fontSize: 8, color: '#DC2626', fontWeight: 'bold', textTransform: 'uppercase' },

  h1: { fontSize: 22, color: '#0F172A', fontWeight: 'bold', marginBottom: 10, width: '95%' },
  h2: { fontSize: 14, color: '#0F172A', fontWeight: 'bold', marginBottom: 5, marginTop: 20 },
  body: { fontSize: 10, color: '#334155', lineHeight: 1.5, textAlign: 'justify' },
  caption: { fontSize: 8, color: '#64748B', marginTop: 4 },

  insightBox: { backgroundColor: '#F8FAFC', padding: 15, borderLeftWidth: 4, borderLeftColor: '#10B981', marginBottom: 20 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  col3: { width: '32%' },
  
  card: { padding: 10, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 4, alignItems: 'center' },
  metricLabel: { fontSize: 8, color: '#64748B', textTransform: 'uppercase' },
  metricValue: { fontSize: 20, color: '#10B981', fontWeight: 'bold', marginTop: 5 },
  metricValueBlue: { fontSize: 20, color: '#3B82F6', fontWeight: 'bold', marginTop: 5 },

  tableHeader: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 5, borderBottomWidth: 1, borderBottomColor: '#0F172A' },
  tableRow: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  cellText: { fontSize: 9, color: '#0F172A' },

  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10 },
  footerText: { fontSize: 8, color: '#94A3B8' }
});

interface PDFData {
  qualCode: string;
  revenueUplift: number;
  cacOffset: string;
  clusterCount: number;
  clusters: Array<{ name: string; revenue: number }>;
}

export const BoardBriefingPDF: React.FC<{ data: PDFData }> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.brand}>ScopeStack AI | Commercial Intelligence</Text>
        <Text style={styles.confidential}>Confidential Board Briefing</Text>
      </View>

      <Text style={styles.h1}>
        Strategic Recommendation: Unbundle {data.qualCode} to unlock revenue velocity.
      </Text>

      <View style={styles.insightBox}>
        <Text style={styles.body}>
          Current market analysis identifies {data.clusterCount || 3} high-demand skill clusters within your existing scope. 
          By restructuring {data.qualCode} into a tiered product stack, we project a 
          <Text style={{fontWeight: 'bold', color: '#10B981'}}> ${data.revenueUplift.toLocaleString()} annualized revenue uplift</Text>. 
          Crucially, the Tier 1 product achieves a <Text style={{fontWeight: 'bold'}}>{data.cacOffset} Marketing Offset</Text>, 
          making customer acquisition self-funding.
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.col3}>
          <View style={styles.card}>
            <Text style={styles.metricLabel}>Net Revenue Uplift</Text>
            <Text style={styles.metricValue}>+${(data.revenueUplift / 1000).toFixed(0)}k</Text>
          </View>
        </View>
        <View style={styles.col3}>
          <View style={styles.card}>
             <Text style={styles.metricLabel}>Marketing Offset</Text>
             <Text style={styles.metricValueBlue}>{data.cacOffset}</Text>
          </View>
        </View>
        <View style={styles.col3}>
          <View style={styles.card}>
             <Text style={styles.metricLabel}>Launch Ready</Text>
             <Text style={{...styles.metricValue, color: '#0F172A'}}>7 Days</Text>
          </View>
        </View>
      </View>

      <Text style={styles.h2}>Projected Revenue Architecture</Text>
      <View style={{height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#CBD5E1', paddingBottom: 5}}>
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 9, marginBottom: 5}}>${(data.clusters[2]?.revenue / 1000).toFixed(0)}k</Text>
          <View style={{width: 60, height: 80, backgroundColor: '#CBD5E1'}} />
          <Text style={{fontSize: 8, marginTop: 5}}>Standard</Text>
        </View>

        <Text style={{marginBottom: 40, color: '#94A3B8'}}>→</Text>

        <View style={{alignItems: 'center'}}>
           <Text style={{fontSize: 9, marginBottom: 5, color: '#10B981', fontWeight: 'bold'}}>+${(data.revenueUplift / 1000).toFixed(0)}k</Text>
           <View style={{width: 60, height: 30, backgroundColor: '#3B82F6'}} />
           <View style={{width: 60, height: 40, backgroundColor: '#10B981'}} />
           <View style={{width: 60, height: 80, backgroundColor: '#CBD5E1', borderTopWidth: 1, borderTopColor: 'white'}} />
           <Text style={{fontSize: 8, marginTop: 5}}>Unbundled</Text>
        </View>
      </View>
      <Text style={styles.caption}>Fig 1.1: Revenue comparison showing yield uplift from stacked delivery models.</Text>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by ScopeStack AI</Text>
        <Text style={styles.footerText}>Page 1 of 2</Text>
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
       <View style={styles.header}>
        <Text style={styles.brand}>ScopeStack AI | Commercial Intelligence</Text>
        <Text style={styles.confidential}>Confidential Board Briefing</Text>
      </View>

      <Text style={styles.h2}>Commercial Product Stack</Text>
      
      <View style={{marginBottom: 20}}>
        <View style={styles.tableHeader}>
           <Text style={[styles.cellText, {width: '40%', fontWeight: 'bold'}]}>Cluster / Tier</Text>
           <Text style={[styles.cellText, {width: '30%', fontWeight: 'bold'}]}>Strategic Role</Text>
           <Text style={[styles.cellText, {width: '30%', textAlign: 'right', fontWeight: 'bold'}]}>Unit Revenue</Text>
        </View>
        
        {data.clusters.map((cluster, i) => (
          <View key={i} style={styles.tableRow}>
             <Text style={[styles.cellText, {width: '40%'}]}>{i+1}. {cluster.name}</Text>
             <Text style={[styles.cellText, {width: '30%', color: '#64748B'}]}>
                {i === 0 ? "Acquisition (Loss Leader)" : "Margin Driver"}
             </Text>
             <Text style={[styles.cellText, {width: '30%', textAlign: 'right'}]}>
                ${cluster.revenue.toLocaleString()}
             </Text>
          </View>
        ))}
         <View style={[styles.tableRow, {backgroundColor: '#F0FDF4'}]}>
             <Text style={[styles.cellText, {width: '70%', fontWeight: 'bold'}]}>TOTAL STACK VALUE</Text>
             <Text style={[styles.cellText, {width: '30%', textAlign: 'right', color: '#10B981', fontWeight: 'bold'}]}>
               ${data.clusters.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
             </Text>
          </View>
      </View>

      <Text style={styles.h2}>90-Day Execution Roadmap</Text>
      <View style={{backgroundColor: '#F8FAFC', padding: 20, borderRadius: 4}}>
         <View style={{flexDirection: 'row', marginBottom: 15}}>
            <Text style={{width: 60, fontSize: 10, fontWeight: 'bold'}}>Month 1</Text>
            <View style={{flex: 1, height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, justifyContent: 'center'}}>
               <View style={{width: '40%', height: '100%', backgroundColor: '#0F172A', borderRadius: 4}} />
            </View>
            <Text style={{marginLeft: 10, fontSize: 9}}>Launch Tier 1</Text>
         </View>
         <View style={{flexDirection: 'row', marginBottom: 15}}>
            <Text style={{width: 60, fontSize: 10, fontWeight: 'bold'}}>Month 2</Text>
            <View style={{flex: 1, height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, justifyContent: 'center'}}>
                <View style={{width: '50%', height: '100%', backgroundColor: '#10B981', marginLeft: '30%', borderRadius: 4}} />
            </View>
            <Text style={{marginLeft: 10, fontSize: 9}}>Activate Upsells</Text>
         </View>
         <View style={{flexDirection: 'row'}}>
            <Text style={{width: 60, fontSize: 10, fontWeight: 'bold'}}>Month 3</Text>
             <View style={{flex: 1, height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, justifyContent: 'center'}}>
                <View style={{width: '30%', height: '100%', backgroundColor: '#3B82F6', marginLeft: '70%', borderRadius: 4}} />
            </View>
            <Text style={{marginLeft: 10, fontSize: 9}}>B2B Scale</Text>
         </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Generated by ScopeStack AI</Text>
        <Text style={styles.footerText}>Page 2 of 2</Text>
      </View>
    </Page>
  </Document>
);