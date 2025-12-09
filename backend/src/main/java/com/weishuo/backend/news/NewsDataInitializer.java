package com.weishuo.backend.news;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 新闻数据初始化器
 * 在应用启动时检查数据库，如果没有备用新闻则自动添加
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class NewsDataInitializer implements CommandLineRunner {

    private final NewsBackupRepository newsBackupRepository;

    @Override
    public void run(String... args) {
        // 检查是否已有备用新闻
        long count = newsBackupRepository.count();
        if (count > 0) {
            log.info("数据库已有 {} 条备用新闻，跳过初始化", count);
            return;
        }

        log.info("开始初始化备用新闻数据...");
        initializeBackupNews();
        log.info("备用新闻初始化完成！");
    }

    private void initializeBackupNews() {
        List<NewsBackup> backupNews = List.of(
            createNews(
                "AI技术突破：GPT-5发布引发行业震动",
                "人工智能领域迎来重大突破，新一代语言模型展现出更强大的理解和推理能力",
                "OpenAI公司正式发布GPT-5，新模型在多项测试中表现优异，引发科技界广泛关注和讨论",
                "科技日报",
                "https://example.com/news/ai-breakthrough",
                "tech",
                LocalDateTime.now().minusHours(2)
            ),
            createNews(
                "新能源汽车销量创历史新高",
                "今年前三季度新能源汽车销量同比增长超过40%，市场渗透率突破30%",
                "随着充电基础设施的完善和技术进步，新能源汽车已成为消费者的主流选择",
                "财经新闻",
                "https://example.com/news/ev-sales",
                "hot",
                LocalDateTime.now().minusHours(4)
            ),
            createNews(
                "量子计算研究取得重大进展",
                "科学家成功实现100量子比特的稳定操控，为量子计算机商用化铺平道路",
                "这一突破标志着量子计算从实验室走向实际应用迈出关键一步",
                "科学时报",
                "https://example.com/news/quantum-computing",
                "tech",
                LocalDateTime.now().minusHours(6)
            ),
            createNews(
                "5G网络覆盖率达到95%",
                "全国5G网络建设进入收尾阶段，城市和主要农村地区实现全覆盖",
                "随着5G网络的普及，智能制造、远程医疗等应用场景快速发展",
                "通信周刊",
                "https://example.com/news/5g-coverage",
                "tech",
                LocalDateTime.now().minusHours(8)
            ),
            createNews(
                "全球气候峰会达成新协议",
                "各国领导人承诺加大减排力度，共同应对气候变化挑战",
                "本次峰会就碳中和时间表和资金支持达成多项共识，为全球气候治理注入新动力",
                "国际新闻",
                "https://example.com/news/climate-summit",
                "hot",
                LocalDateTime.now().minusHours(10)
            ),
            createNews(
                "教育部推出AI辅助教学平台",
                "新平台将为师生提供个性化教学辅助，推动教育数字化转型",
                "该平台整合了优质教育资源，通过AI技术实现因材施教",
                "教育在线",
                "https://example.com/news/ai-education",
                "society",
                LocalDateTime.now().minusHours(12)
            ),
            createNews(
                "医疗AI诊断准确率超过专家水平",
                "最新研究显示，AI系统在多种疾病诊断中的准确率已超过人类医生",
                "这项技术有望缓解医疗资源紧张，提高基层医疗服务水平",
                "健康时报",
                "https://example.com/news/medical-ai",
                "tech",
                LocalDateTime.now().minusHours(14)
            ),
            createNews(
                "太空探索迎来新里程碑",
                "载人登月任务成功完成，宇航员采集到珍贵月球样本",
                "此次任务标志着人类太空探索能力达到新高度，为未来深空探测奠定基础",
                "航天新闻",
                "https://example.com/news/space-exploration",
                "tech",
                LocalDateTime.now().minusHours(16)
            ),
            createNews(
                "生物科技突破：基因编辑治愈罕见病",
                "科学家利用CRISPR技术成功治愈一名罕见病患者，开创医学新纪元",
                "这一成功案例为更多遗传病患者带来希望",
                "医学前沿",
                "https://example.com/news/gene-therapy",
                "tech",
                LocalDateTime.now().minusHours(18)
            ),
            createNews(
                "智慧城市建设全面提速",
                "多个城市启动智慧城市2.0建设，打造数字孪生城市样板",
                "通过物联网、大数据等技术，城市管理效率大幅提升",
                "城市观察",
                "https://example.com/news/smart-city",
                "society",
                LocalDateTime.now().minusHours(20)
            ),
            createNews(
                "绿色能源装机容量突破新高",
                "风电、光伏等可再生能源装机容量占比超过50%",
                "清洁能源快速发展，为实现碳中和目标提供有力支撑",
                "能源报",
                "https://example.com/news/green-energy",
                "hot",
                LocalDateTime.now().minusHours(22)
            ),
            createNews(
                "元宇宙产业规模持续扩大",
                "今年元宇宙相关产业规模预计突破5000亿元",
                "虚拟现实、增强现实等技术应用场景不断丰富",
                "科技观察",
                "https://example.com/news/metaverse",
                "tech",
                LocalDateTime.now().minusHours(24)
            ),
            createNews(
                "电子商务促进乡村振兴",
                "农村电商销售额同比增长60%，助力农民增收致富",
                "直播带货、社区团购等新模式为农产品打开销路",
                "经济日报",
                "https://example.com/news/rural-ecommerce",
                "society",
                LocalDateTime.now().minusHours(26)
            ),
            createNews(
                "自动驾驶商业化运营提速",
                "多家企业获批在特定区域开展无人驾驶出租车服务",
                "自动驾驶技术日趋成熟，商业化进程加快",
                "汽车周刊",
                "https://example.com/news/autonomous-driving",
                "tech",
                LocalDateTime.now().minusHours(28)
            ),
            createNews(
                "文化遗产数字化保护工程启动",
                "国家投入专项资金，对重点文物进行3D扫描和数字化存档",
                "数字技术让文化遗产焕发新生，实现永久保存和广泛传播",
                "文化周刊",
                "https://example.com/news/digital-heritage",
                "society",
                LocalDateTime.now().minusHours(30)
            ),
            createNews(
                "区块链技术赋能供应链管理",
                "企业应用区块链实现商品全程溯源，提升供应链透明度",
                "该技术有效解决了假冒伪劣、信息不对称等问题",
                "物流快讯",
                "https://example.com/news/blockchain-supply",
                "tech",
                LocalDateTime.now().minusHours(32)
            ),
            createNews(
                "在线教育用户规模突破5亿",
                "疫情后在线教育持续发展，成为教育行业重要组成部分",
                "个性化学习、AI辅导等创新模式受到用户欢迎",
                "教育新闻",
                "https://example.com/news/online-education",
                "society",
                LocalDateTime.now().minusHours(34)
            ),
            createNews(
                "半导体产业实现关键技术突破",
                "国产芯片在高端制程上取得重大进展，打破技术壁垒",
                "这一突破将增强产业链安全性和自主可控能力",
                "芯片周刊",
                "https://example.com/news/semiconductor",
                "tech",
                LocalDateTime.now().minusHours(36)
            ),
            createNews(
                "数字人民币应用场景持续拓展",
                "已在300多个城市试点，覆盖零售、交通、政务等领域",
                "数字货币推动支付体系变革，提升金融服务效率",
                "金融时报",
                "https://example.com/news/digital-yuan",
                "hot",
                LocalDateTime.now().minusHours(38)
            ),
            createNews(
                "体育产业数字化转型加速",
                "VR观赛、AI裁判等新技术改变传统体育体验",
                "数字技术让体育赛事更精彩，观众参与感更强",
                "体育周刊",
                "https://example.com/news/sports-tech",
                "video",
                LocalDateTime.now().minusHours(40)
            )
        );

        newsBackupRepository.saveAll(backupNews);
        log.info("已添加 {} 条备用新闻到数据库", backupNews.size());
    }

    private NewsBackup createNews(String title, String summary, String content, 
                                   String source, String url, String category,
                                   LocalDateTime publishedAt) {
        return NewsBackup.builder()
                .title(title)
                .summary(summary)
                .content(content)
                .source(source)
                .url(url)
                .category(category)
                .publishedAt(publishedAt)
                .build();
    }
}
