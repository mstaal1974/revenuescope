
"use client";

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// --- STYLES (Professional Board Look) ---
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff', color: '#2d3748' },
  
  // Header Section
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, borderBottomWidth: 2, borderBottomColor: '#1a365d', paddingBottom: 10, borderBottomStyle: 'solid' },
  brand: { fontSize: 20, color: '#1a365d', fontFamily: 'Helvetica-Bold' },
  date: { fontSize: 10, color: '#718096', marginTop: 8 },

  // Titles
  title: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#2d3748', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#718096', marginBottom: 20 },

  // Executive Summary Box
  summaryBox: { backgroundColor: '#f7fafc', padding: 15, borderRadius: 5, marginBottom: 25, borderLeftWidth: 4, borderLeftColor: '#3182ce', borderLeftStyle: 'solid' },
  summaryText: { fontSize: 11, lineHeight: 1.5, color: '#2d3748' },

  // Financial Highlight (The "Money" Shot)
  metricContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  metricBox: { width: '48%', padding: 10, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 5, borderStyle: 'solid' },
  metricLabel: { fontSize: 10, color: '#718096', textTransform: 'uppercase' },
  metricValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#2d3748', marginTop: 5 },
  upliftValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: '#38a169', marginTop: 5 },

  // The Table (Revenue Staircase)
  table: { width: '100%', borderTopWidth: 1, borderTopColor: '#e2e8f0', marginTop: 10, borderTopStyle: 'solid' },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 8, alignItems: 'center', borderBottomStyle: 'solid' },
  headerRow: { backgroundColor: '#edf2f7', borderTopWidth: 1, borderTopColor: '#e2e8f0', borderTopStyle: 'solid' },
  col1: { width: '15%', fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#4a5568' }, // Tier
  col2: { width: '45%', fontSize: 10, color: '#2d3748' }, // Product
  col3: { width: '15%', fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#2d3748' }, // Price
  col4: { width: '25%', fontSize: 9, color: '#718096', fontStyle: 'italic' }, // Strategy

  // AI Section
  aiSection: { marginTop: 30, padding: 15, backgroundColor: '#f0fff4', borderRadius: 5, borderWidth: 1, borderColor: '#c6f6d5', borderStyle: 'solid' },
  sectionTitle: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#22543d', marginBottom: 5 },
  text: { fontSize: 10, marginBottom: 5, lineHeight: 1.4 },
  bold: { fontFamily: 'Helvetica-Bold' }
});

type MappedTier = {
    level: string;
    product_name: string;
    price: string;
    tactic: string;
}

export type MappedPdfData = {
    strategy_summary: string;
    revenue_comparison: {
        traditional_model: string;
        unbundled_model: string;
        increase_percentage: string;
    };
    tiers: MappedTier[];
    ai_opportunity?: {
        product_title: string;
        target_tool: string;
        marketing_hook: string;
    };
}


interface BoardReportPDFProps {
    data: MappedPdfData;
    rtoCode: string;
    rtoName: string;
}


// --- THE DOCUMENT COMPONENT ---
export const BoardReportPDF = ({ data, rtoCode, rtoName }: BoardReportPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* 1. Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>ScopeStack™ Analysis</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString()}</Text>
      </View>

      {/* 2. Title Block */}
      <Text style={styles.title}>Commercial Opportunity Report</Text>
      <Text style={styles.subtitle}>{rtoCode} - {rtoName}</Text>

      {/* 3. Executive Summary */}
      {data.strategy_summary && (
        <View style={styles.summaryBox}>
            <Text style={{...styles.bold, fontSize: 12, marginBottom: 5, color: '#2b6cb0'}}>Strategy Summary:</Text>
            <Text style={styles.summaryText}>{data.strategy_summary}</Text>
        </View>
      )}

      {/* 4. Financial Metrics */}
      {data.revenue_comparison && (
        <View style={styles.metricContainer}>
            <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Bundled Product Value</Text>
                <Text style={styles.metricValue}>{data.revenue_comparison.traditional_model}</Text>
            </View>
            <View style={[styles.metricBox, {backgroundColor: '#f0fff4', borderColor: '#9ae6b4'}]}>
                <Text style={styles.metricLabel}>Unbundled Stack Value</Text>
                <Text style={styles.upliftValue}>{data.revenue_comparison.unbundled_model} ({data.revenue_comparison.increase_percentage})</Text>
            </View>
        </View>
      )}


      {/* 5. The Revenue Staircase (Table) */}
      {data.tiers && data.tiers.length > 0 && (
          <>
            <Text style={{...styles.bold, fontSize: 14, marginTop: 10, marginBottom: 5}}>Recommended Product Architecture</Text>
            <View style={styles.table}>
                {/* Table Header */}
                <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.col1, {paddingLeft: 5}]}>Level</Text>
                <Text style={styles.col2}>Product Name</Text>
                <Text style={styles.col3}>Price</Text>
                <Text style={styles.col4}>Tactic</Text>
                </View>
                
                {/* Table Rows (Dynamic) */}
                {data.tiers.map((tier, index) => (
                <View key={index} style={styles.row}>
                    <Text style={[styles.col1, {paddingLeft: 5}]}>{tier.level}</Text>
                    <Text style={styles.col2}>{tier.product_name}</Text>
                    <Text style={styles.col3}>{tier.price}</Text>
                    <Text style={styles.col4}>{tier.tactic}</Text>
                </View>
                ))}
            </View>
          </>
      )}


      {/* 6. AI Opportunity Section */}
      {data.ai_opportunity?.product_title && (
        <View style={styles.aiSection}>
            <Text style={styles.sectionTitle}>🚀 Future-Proofing: The AI Opportunity</Text>
            <Text style={styles.text}><Text style={styles.bold}>Recommended Micro-Credential:</Text> {data.ai_opportunity.product_title}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Tool Stack:</Text> {data.ai_opportunity.target_tool}</Text>
            <Text style={[styles.text, {fontStyle:'italic', marginTop: 5}]}>"{data.ai_opportunity.marketing_hook}"</Text>
        </View>
      )}


      {/* Footer */}
      <Text style={{position: 'absolute', bottom: 30, left: 40, fontSize: 8, color: '#cbd5e0'}}>
        Generated by ScopeStack AI | microcredentials.io
      </Text>

    </Page>
  </Document>
);
