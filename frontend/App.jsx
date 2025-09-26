import TrafficChart from './TrafficChart'

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, Arial' }}>
      <h1>🚦 VPS Live Traffic Monitor</h1>
      <p>
        This page fetches traffic data from your VPS API and shows incoming / outgoing bytes/s.
      </p>
      <TrafficChart />
      <footer style={{ marginTop: 16, color: '#666' }}>
        Replace <code>VPS_API</code> in <code>TrafficChart.jsx</code> with your VPS IP.
      </footer>
    </div>
  )
}
