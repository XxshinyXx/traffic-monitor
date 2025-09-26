import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// CHANGE THIS to your VPS address, e.g. http://123.45.67.89:8000/traffic
const VPS_API = 'http://171.22.18.15:8000/traffic'

export default function TrafficChart() {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(VPS_API)
        if (!res.ok) throw new Error('Network response not ok')
        const json = await res.json()
        setData((d) => [
          ...d.slice(-60),
          { time: new Date().toLocaleTimeString(), recv: json.recv || 0, send: json.send || 0 },
        ])
        setError(null)
      } catch (e) {
        setError(e.message)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error fetching: {error}</div>}
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="time" minTickGap={20} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="recv" name="Incoming (bytes/s)" stroke="#82ca9d" dot={false} />
            <Line type="monotone" dataKey="send" name="Outgoing (bytes/s)" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
