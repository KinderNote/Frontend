import React from 'react';
import { Page, Text, View, Document } from '@react-pdf/renderer';
import {styles} from '../../components/PDF/styles.js'

// Componente del documento PDF
export const InformePdfDocument = ({ alumno, areas }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Título Principal */}
      <Text style={styles.title}>
        INFORME DE {alumno.nombre.toUpperCase()}
      </Text>

      {/* Bloque de Datos del Alumno y Docente */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.label}>Nombre y apellido:</Text>
          <Text style={styles.value}>{alumno.nombre}</Text>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.label}>Sala:</Text>
          <Text style={styles.value}>{alumno.aula}</Text>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.label}>Edad:</Text>
          <Text style={styles.value}>{alumno.edad}</Text>
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.label}>Docente:</Text>
          <Text style={styles.value}>{alumno.docente}</Text>
        </View>

        <View style={{ ...styles.headerRow, marginBottom: 0 }}>
          <Text style={styles.label}>Fecha del informe:</Text>
          <Text style={styles.value}>{alumno.fechaInforme}</Text>
        </View>
      </View>

      {/* Mapeo iterativo de las áreas y textos generados por Gemini */}
      {areas && areas.map((item, index) => (
        <View key={index} style={styles.areaSection} wrap={false}>
          <Text style={styles.areaTitle}>{item.area}</Text>
          <Text style={styles.areaText}>{item.texto}</Text>
        </View>
      ))}

      {/* Pie de página con numeración de páginas */}
      <Text 
        style={styles.footer} 
        render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} 
        fixed 
      />

    </Page>
  </Document>
);