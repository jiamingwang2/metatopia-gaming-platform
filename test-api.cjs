// API端点测试脚本
// 用于验证部署后的API是否正常工作

const axios = require('axios');

// 测试配置
const TEST_CONFIG = {
  // 本地测试
  local: 'http://localhost:3001/api',
  // 生产环境测试（需要替换为实际的Vercel部署URL）
  production: 'https://metatopia-platform.vercel.app/api'
};

// 测试函数
async function testApiEndpoint(baseUrl, environment) {
  console.log(`\n🧪 Testing ${environment} environment: ${baseUrl}`);
  
  try {
    // 测试健康检查端点
    console.log('📡 Testing health check...');
    const healthResponse = await axios.get(`${baseUrl}/health`, {
      timeout: 10000
    });
    console.log('✅ Health check passed:', healthResponse.data);
    
    // 测试认证端点（POST请求）
    console.log('🔐 Testing auth endpoints...');
    
    // 测试登录端点（应该返回400错误，因为没有提供数据）
    try {
      await axios.post(`${baseUrl}/auth/login`, {}, {
        timeout: 10000
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Auth login endpoint accessible (returned expected 400)');
      } else {
        throw error;
      }
    }
    
    // 测试注册端点（应该返回400错误，因为没有提供数据）
    try {
      await axios.post(`${baseUrl}/auth/register`, {}, {
        timeout: 10000
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ Auth register endpoint accessible (returned expected 400)');
      } else {
        throw error;
      }
    }
    
    console.log(`🎉 ${environment} API tests completed successfully!`);
    return true;
    
  } catch (error) {
    console.error(`❌ ${environment} API test failed:`);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return false;
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 Starting API endpoint tests...');
  
  const results = {};
  
  // 测试本地环境
  results.local = await testApiEndpoint(TEST_CONFIG.local, 'Local');
  
  // 测试生产环境
  results.production = await testApiEndpoint(TEST_CONFIG.production, 'Production');
  
  // 输出测试结果
  console.log('\n📊 Test Results Summary:');
  console.log('Local:', results.local ? '✅ PASS' : '❌ FAIL');
  console.log('Production:', results.production ? '✅ PASS' : '❌ FAIL');
  
  if (results.production) {
    console.log('\n🎉 Production API is working! The deployment issue has been resolved.');
  } else {
    console.log('\n⚠️  Production API is still not working. Further investigation needed.');
  }
}

// 运行测试
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testApiEndpoint, runTests };