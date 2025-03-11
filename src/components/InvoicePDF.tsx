import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { InvoiceData } from '../types/invoice';

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica',
    fontSize: 12,
    maxWidth: 620,
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderBottom: '5px solid #00b3b3',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: 70,
  },
  companyTitle: {
    marginLeft: 10,
  },
  techiusText: {
    color: '#0088cc',
    fontSize: 24,
    fontWeight: 'bold',
  },
  solutionsText: {
    color: '#ffcc00',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 10,
    color: '#666666',
    marginTop: 5,
  },
  companyInfo: {
    textAlign: 'right',
    fontSize: 12,
  },
  companyInfoRow: {
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  invoiceSection: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  invoiceTitle: {
    color: '#666666',
    fontSize: 28,
    fontWeight: 'normal',
    marginBottom: 5,
  },
  billToLabel: {
    backgroundColor: '#00b3b3',
    color: 'white',
    padding: '2 8',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
  },
  billToInfo: {
    fontSize: 14,
  },
  billToName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateInfo: {
    textAlign: 'right',
    fontSize: 14,
  },
  itemsSection: {
    padding: '0 15',
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ddd',
    padding: '10 0',
    fontWeight: 'bold',
    color: '#666666',
    fontSize: 14,
  },
  itemTitle: {
    color: '#0066cc',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 15,
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    fontSize: 14,
  },
  itemDescription: {
    flex: 1,
  },
  itemAmount: {
    width: 100,
    textAlign: 'right',
  },
  totalSection: {
    borderTop: '1px solid #ddd',
    marginTop: 15,
    padding: '10 15',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
    borderBottom: '1px solid #ddd',
    padding: '10 0',
  },
  finalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10 0',
  },
  amountInWords: {
    backgroundColor: '#666666',
    color: 'white',
    padding: '2 5',
    fontSize: 12,
    marginRight: 5,
  },
  finalAmount: {
    backgroundColor: '#00b3b3',
    color: 'white',
    padding: '2 8',
    fontWeight: 'bold',
    fontSize: 16,
  },
  paymentSection: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentTitle: {
    fontWeight: 'bold',
    textDecoration: 'underline',
    marginBottom: 10,
  },
  signatureSection: {
    textAlign: 'right',
    width: 200,
  },
  stamp: {
    width: 80,
    height: 80,
    marginTop: 10,
  },
  thankYou: {
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
    borderTop: '1px solid #ddd',
    borderBottom: '1px solid #ddd',
  },
  quote: {
    backgroundColor: '#666666',
    color: 'white',
    padding: 10,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 14,
  },
  note: {
    backgroundColor: '#00b3b3',
    color: 'white',
    padding: 15,
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noteList: {
    paddingLeft: 20,
  },
});

interface InvoicePDFProps {
  data: InvoiceData;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ data }) => {
  const total = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const finalAmount = total - data.discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              src="https://techiussolutions.in/wp-content/uploads/2023/12/logo.png"
              style={styles.logo}
            />
            <View style={styles.companyTitle}>
              <Text style={styles.techiusText}>TECHIUS</Text>
              <Text style={styles.solutionsText}>SOLUTIONS</Text>
              <Text style={styles.tagline}>EXPERIENCE THE DIGITAL INNOVATION</Text>
            </View>
          </View>
          <View style={styles.companyInfo}>
            <Text style={styles.companyInfoRow}><Text style={styles.bold}>Techius Solutions,</Text> Mallappally, Kerala</Text>
            <Text style={styles.companyInfoRow}><Text style={styles.bold}>UAM No:</Text> KL11D0004260</Text>
            <Text style={styles.companyInfoRow}><Text style={styles.bold}>Phone :</Text> +91-9961560545</Text>
            <Text style={styles.companyInfoRow}><Text style={styles.bold}>Web :</Text> www.techiussolutions.in</Text>
            <Text style={styles.companyInfoRow}><Text style={styles.bold}>E-mail :</Text> info@techiussolutions.in</Text>
          </View>
        </View>

        <View style={styles.invoiceSection}>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.billToLabel}>BILL TO</Text>
            <View style={styles.billToInfo}>
              <Text style={styles.billToName}>{data.client.name}</Text>
              <Text>{data.client.address}</Text>
            </View>
          </View>
          <View style={styles.dateInfo}>
            <Text><Text style={styles.bold}>Date :</Text> {format(new Date(data.date), 'dd/MM/yyyy')}</Text>
            <Text><Text style={styles.bold}>Invoice No :</Text> {data.invoice_number}</Text>
          </View>
        </View>

        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <Text>ITEM</Text>
            <Text>AMOUNT</Text>
          </View>

          <Text style={styles.itemTitle}>{data.client.name} Website Annual Charges</Text>

          {data.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemAmount}>₹ {(item.quantity * item.unit_price).toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.bold}>TOTAL</Text>
            <Text style={styles.bold}>₹{total.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.bold}>DISCOUNT</Text>
            <Text>₹{data.discount.toLocaleString()}</Text>
          </View>
          <View style={styles.finalRow}>
            <Text style={styles.bold}>FINAL TO BE PAID</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.amountInWords}>Rupees {finalAmount.toLocaleString()} Only</Text>
              <Text style={styles.finalAmount}>₹ {finalAmount.toLocaleString()}/-</Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <View style={styles.paymentDetails}>
            <Text style={styles.paymentTitle}>Payment Account Details</Text>
            <Text><Text style={styles.bold}>Account Holder:</Text> Jithin Jacob Issac</Text>
            <Text><Text style={styles.bold}>Bank Name:</Text> Federal Bank</Text>
            <Text><Text style={styles.bold}>Account Number:</Text> 79980111697400</Text>
            <Text><Text style={styles.bold}>IFSC:</Text> FDRL0001443</Text>
            <Text><Text style={styles.bold}>Branch:</Text> Mallappally</Text>
          </View>
          <View style={styles.signatureSection}>
            <Text>For Techius Solutions ,</Text>
            <Text style={{ marginTop: 5 }}>RICHU EAPEN GEORGE</Text>
            <Image
              src="https://techiussolutions.in/wp-content/uploads/2024/03/stamp.png"
              style={styles.stamp}
            />
          </View>
        </View>

        <Text style={styles.thankYou}>Thank You for your business !</Text>

        <Text style={styles.quote}>
          "Logic will get you from A to B. Imagination will take you everywhere." - Albert Einstein
        </Text>

        <View style={styles.note}>
          <Text style={styles.noteTitle}>Note:</Text>
          <View style={styles.noteList}>
            <Text>• Server downtime may occur rarely during scheduled maintenances or damages due to natural disasters.</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;