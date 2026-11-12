// Definición de estilos profesionales
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: '#2A2A2A',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    color: '#1A365D',
  },
  headerContainer: {
    backgroundColor: '#F7FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 25,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 140,
    fontFamily: 'Helvetica-Bold',
    color: '#4A5568',
  },
  value: {
    flex: 1,
    color: '#1A202C',
  },
  areaSection: {
    marginBottom: 18,
  },
  areaTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2B6CB0',
    borderBottomWidth: 1,
    borderBottomColor: '#BEE3F8',
    paddingBottom: 4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  areaText: {
    textAlign: 'justify',
    color: '#2D3748',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#A0AEC0',
  }
});